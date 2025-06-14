//------------------------------
//last updated time
//------------------------------
async function lastUpdateDisplay() {
	let updateTimestampResponse = await fetch('./lastupdate.txt');
	let updateTimestampString = await updateTimestampResponse.text();
	document.getElementById("lastupdatedisplay").innerHTML="Last update of driver/constructor data: " + updateTimestampString;
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
		costcapvalue = parseFloat(costcaptext);
	}
	if(isNaN(costcapvalue)) {
		costcap = 0.0;
	} else {
		costcap = costcapvalue;
	}
}

function costCapInputBlurListener(e) {
	e.target.value = ""+costcap;
}

//------------------------------
//pred data ui
//------------------------------
function predDataInit() {
	let predDataInput = document.getElementById("preddatainput");
	predDataInput.addEventListener("input", predDataInputChangeListener);
	predDataInputChangeListener(null);
}
function predDataInputChangeListener(e) {
	let predDataInput = document.getElementById("preddatainput");
	let predDataStatus = document.getElementById("preddatastatus");
	const jsonString = predDataInput.value;
	let invalidMessage = validateJson(jsonString);
	if (invalidMessage.length == 0) {
		predDataStatus.innerHTML = "JSON Parsed OK";
	} else {
		predDataStatus.innerHTML = invalidMessage;
	}
}
function validateJson(jsonString) {
	let failMessage = "";
	try {
		predData = JSON.parse(jsonString);
		let valid = "drivers" in predData
			&& "constructors" in predData
			&& "pts" in predData.drivers
			&& "pts" in predData.constructors;
		if (!valid) {
			failMessage = "Could not find constructor.pts and drivers.pts properties in JSON.";
		}
	} catch(error) {
		failMessage = "Could not parse input as JSON";
	}
	return failMessage;
}

//------------------------------
//num free transfers ui
//------------------------------
function freeTransferInputInit() {
	let freetransfersinput = document.getElementById("freetransfersinput");
	freetransfersinput.value = ""+freetransfers;
	freetransfersinput.addEventListener("input", freeTransferChangeListener);
	freetransfersinput.addEventListener("blur", freeTransferInputBlurListener);
}

function freeTransferChangeListener(e) {
	let freetransfertext = e.target.value;
	let freetransfervalue = 0;
	if (freetransfertext.length > 0) {
		freetransfervalue = parseInt(freetransfertext);
	}
	if(isNaN(freetransfervalue)) {
		freetransfers = 0;
	} else {
		freetransfers = freetransfervalue;
	}
}

function freeTransferInputBlurListener(e) {
	e.target.value = ""+freetransfers;
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
		if (driver.active) {
			label.innerHTML = driver.name;
		} else {
			label.innerHTML = driver.name + " ("+driver.team+" - INACTIVE)";
		}
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
