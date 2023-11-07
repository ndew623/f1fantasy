function saveSettings(e) {
	let jsonString = getJsonString();
	const blob = new Blob([jsonString], { type: 'application/json'})
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = "f1-fantasy-solver-settings.json";
	link.click();
	URL.revokeObjectURL(url);
}

function getJsonString() {
	let json = "{";
	json += '"costcap":'+costcap+", ";
	json += '"finishorder": [';
	for (let i = 0; i < alldrivers.length; i++) {
		driver = alldrivers[i];
		json += '{"id":"'+driver.id+'", "pos":'+driver.predpos+'}';
		if (i < alldrivers.length -1) {
			json += ", ";
		}
	}
	json += '], ';
	json += '"freetransfers":'+freetransfers+", ";
	json += '"currdrivers": [';
	for (let i = 0; i < currDriverPicks.length; i++) {
		json += '"'+currDriverPicks[i]+'"';
		if (i < currDriverPicks.length -1) {
			json += ", ";
		}
	}
	json += '], ';
	json += '"currteams": [';
	for (let i = 0; i < currTeamPicks.length; i++) {
		json += '"'+currTeamPicks[i]+'"';
		if (i < currTeamPicks.length -1) {
			json += ", ";
		}
	}
	json += ']';

	json += "}";
	return json;
}

function loadSettings(e) {
	let input = e.target;
	if (input.files.length > 0) {
		let file = input.files[0];
		let reader = new FileReader();
		reader.onload = function(event) {
			let fileContent = event.target.result;
			try {
				let settings = JSON.parse(fileContent);
				applySettings(settings);
			} catch (error) {
				console.error("Could not parse loaded settings: " + error)
			}
		}
		reader.readAsText(file);
	}
}

function applySettings(settings) {
	//clear current picks to default values
	resetCurrentPicks();
	displayCurrentPicksOptions();
	currDriverPicks = [];
	currTeamPicks = [];


	costcap = settings.costcap;
	document.getElementById("costcapinput").value=""+costcap;
	settings.finishorder.forEach(element=>{
		document.getElementById(element.id+"-predpos").value=element.pos+"";
		alldrivers.forEach(driver=>{
			if (driver.id === element.id) {
				driver.predpos = element.pos;
			}
		});
	});
	freetransfers = settings.freetransfers;
	document.getElementById("freetransfersinput").value=""+freetransfers;
	settings.currdrivers.forEach(element=>{
		document.getElementById(element+"-currdrivpick").checked=true;
		currDriverPicks.push(element);
	});
	settings.currteams.forEach(element=>{
		document.getElementById(element+"-currteampick").checked=true;
		currTeamPicks.push(element);
	});
	updateSortedFinish();
}
