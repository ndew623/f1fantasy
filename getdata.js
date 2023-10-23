var alldrivers = [];
var allteams = [];
var alldriversWithInactive = [];
var allteamsWithInactive = [];
async function getData() {
	try {
		let constructorResponse = await fetch('./constructors.json');
		let constructorJson = await constructorResponse.json();
		constructorJson.forEach(team => {
			allteamsWithInactive.push(team);
			if (team.active) {
				allteams.push(team);
			}
		});
	} catch (error) {
		console.log('Error getting constructor data: ' + error);
		return;
	}
	try {
		let driverResponse = await fetch('./drivers.json');
		let driverJson = await driverResponse.json();
		driverJson.forEach(driver => {
			alldriversWithInactive.push(driver);
			if (driver.active) {
				alldrivers.push({
					id: driver.id,
					name: driver.name,
					cost: driver.cost,
					team: driver.team,
					teamid: driver.teamid,
					predpos: 1
				});
			}
		});
	} catch (error) {
		console.log('Error getting driver data: ' + error);
		return;
	}
}
