//------------------------------
//last updated time
//------------------------------
async function lastUpdateDisplay() {
	let updateTimestampResponse = await fetch('./lastupdate.txt');
	let updateTimestampString = await updateTimestampResponse.text();
	document.getElementById("lastupdatedisplay").innerHTML="Last update of driver/constructor data: " + updateTimestampString + " (UTC)";
}

//------------------------------
//save/load ui
//------------------------------


function saveLoadButtonInit() {
	let savebutton = document.getElementById("savebutton");
	savebutton.addEventListener("click", saveSettings);
	let loadinput = document.getElementById("loadinput");
	loadinput.addEventListener("change", loadSettings);
}

//------------------------------
//cost cap ui
//------------------------------
function costCapInputInit() {
	let costcapinput = document.getElementById("costcapinput");
	costcapinput.value = ""+costcap;
	costcapinput.addEventListener("input", costCapChangeListener);
	costcapinput.addEventListener("blur", costCapInputBlurListener);
}

function costCapChangeListener(e) {
	let costcaptext = e.target.value;
	let costcapvalue = 0.0;
	if (costcaptext.length > 0) {
		costcapvalue = parseFloat(e.target.value);
	}
	if(isNaN(costcapvalue)) {
		costcap = 0.0
	} else {
		costcap = costcapvalue;
	}
}

function costCapInputBlurListener(e) {
	e.target.value = ""+costcap;
}


//------------------------------
//finish order prediction ui
//------------------------------

function resetFinishOrder() {
	let orderSelect = document.getElementById("orderSelect");
	let orderDisplay = document.getElementById("orderDisplay");
	orderSelect.innerHTML = "";
	orderDisplay.innerHTML = "";
}
function displayFinishOrder() {
	let orderSelect = document.getElementById("orderSelect");
	alldrivers.forEach(driver => {
		let label = document.createElement('label');
		label.innerHTML = driver.name;
		let input = document.createElement('input');
		input.setAttribute("type", "number");
		input.setAttribute("id", driver.id+"-predpos");
		input.setAttribute("min", "1");
		input.setAttribute("max", ""+alldrivers.length);
		input.setAttribute("value", driver.predpos);
		input.addEventListener("input", positionValueChangeListener);

		let tr = document.createElement('tr');
		let td = document.createElement('td');
		td.appendChild(label);
		td.appendChild(input);
		tr.appendChild(td);
		orderSelect.appendChild(tr);
	});
}
function positionValueChangeListener(e) {
	let id = e.target.id.replace("-predpos", "");
	let value = parseInt(e.target.value);
	if (isNaN(value) || value < 1) {
		value = 1;
	}
	if (value > alldrivers.length) {
		value = alldrivers.length;
	}
	alldrivers.forEach(driver => {
		if (driver.id === id) {
			driver.predpos = value;
		}
	});
	updateSortedFinish();
}

function updateSortedFinish() {
	let sortedFinishDisplay = document.getElementById("sortedFinishOrder");
	let positions = alldrivers.map(driver => {return {position: driver.predpos, name: driver.name}});
	positions.sort((a,b) => {return a.position - b.position});
	let finishOrderText = "";
	positions.forEach(driver => {
		finishOrderText+="("+driver.position+") " + driver.name + "\n";
	});
	sortedFinishDisplay.innerHTML=finishOrderText;
}



//------------------------------
//current picks ui
//------------------------------

function resetCurrentPicks() {
	let currentDriverPicks = document.getElementById("currentDriverPicks");
	let currentTeamPicks = document.getElementById("currentTeamPicks");
	currentDriverPicks.innerHTML = "";
	currentTeamPicks.innerHTML = "";
}

function displayCurrentPicksOptions() {
	let currentDriverPicksElement = document.getElementById("currentDriverPicks");
	alldriversWithInactive.forEach(driver => {
		let label = document.createElement('label');
		label.innerHTML = driver.name;
		let input = document.createElement('input');
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", driver.id+"-currdrivpick");
		input.setAttribute("value", "unchecked");
		input.addEventListener("input", currPickDriverCheckChangeListener);

		currentDriverPicksElement.appendChild(label);
		currentDriverPicksElement.appendChild(input);
		currentDriverPicksElement.appendChild(document.createElement('br'));
	});

	let currentTeamPicksElement = document.getElementById("currentTeamPicks");
	allteamsWithInactive.forEach(team => {
		let label = document.createElement('label');
		label.innerHTML = team.name;
		let input = document.createElement('input');
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", team.id+"-currteampick");
		input.setAttribute("value", "unchecked");
		input.addEventListener("input", currPickTeamCheckChangeListener);

		currentTeamPicksElement.appendChild(label);
		currentTeamPicksElement.appendChild(input);
		currentTeamPicksElement.appendChild(document.createElement('br'));
	});
}

function currPickDriverCheckChangeListener(e) {
	let id = e.target.id.replace("-currdrivpick", "");
	if (e.target.checked) {
		currDriverPicks.push(id);
	} else {
		let index = currDriverPicks.indexOf(id);
		if (index > -1) {
			currDriverPicks.splice(index,1);
		}
	}
}
function currPickTeamCheckChangeListener(e) {
	let id = e.target.id.replace("-currteampick", "");
	if (e.target.checked) {
		currTeamPicks.push(id);
	} else {
		let index = currTeamPicks.indexOf(id);
		if (index > -1) {
			currTeamPicks.splice(index,1);
		}
	}
}


//------------------------------
//get/show results ui
//------------------------------

function getPicksButtonInit() {
	document.getElementById("getPicksButton").addEventListener("click", getPicksButtonPress);
}

function getPicksButtonPress(e) {
	let resultsDisplayElement = document.getElementById("resultsDisplay");
	let allBestPicks = getBestPicks();
	let bestpicks = allBestPicks.best;

	let displayText = "Highest points with most budget spent:\n";
	displayText += "----------------------------------------\n";
	displayText += getPicksDisplayString(bestpicks);

	let altPickCount = 1;
	allBestPicks.samepoints.forEach(picks => {
		displayText += "\n\nHighest points alternate pick #" + altPickCount + "\n";
		displayText += "----------------------------------------\n";
		displayText += getPicksDisplayString(picks);
		altPickCount++;
	});

	let closePickCount = 1;
	allBestPicks.closePoints.forEach(picks => {
		displayText += "\n\nClose to most points pick #" + closePickCount + " (Within "+closePointsThreshold+" points)\n";
		displayText += "----------------------------------------\n";
		displayText += getPicksDisplayString(picks);
		closePickCount++;
	});

	resultsDisplayElement.innerHTML = displayText;
}

function getPicksDisplayString(picks) {
	let picksText = "";
	picksText += "Expected points: " + picks.expectedpoints + "\n";
	picksText += "Cost: " + picks.cost + "\n";
	let numtransfers = getNumTransfers(picks.driverindexes, picks.teamindexes);
	picksText += "Num Transfers: " + numtransfers;
	if (transferPenalties(numtransfers) > 0) {
		picksText += " (-"+transferPenalties(numtransfers)+" points)";
	}
	picksText += '\n';
	picksText += "Drivers:" + "\n";
	picks.driverindexes.forEach(driverindex => {
		let points = calcDriversPoints([driverindex]);
		if (driverindex === picks.DRSdriverindex) {
			points *= 2;
		}
		picksText += "    "+alldrivers[driverindex].name + ". Points: "+ points;
		picksText += ". Cost: " + alldrivers[driverindex].cost;
		if (driverindex === picks.DRSdriverindex) {
			picksText += " (DRS 2x)";
		}
		picksText += "\n";
	});
	picksText += "Teams:" + "\n";
	picks.teamindexes.forEach(teamindex => {
		picksText += "    " + allteams[teamindex].name + ". Score: "+ calcTeamsPoints([teamindex]) + ". Cost: " + allteams[teamindex].cost + "\n";
	});
	return picksText;
}
