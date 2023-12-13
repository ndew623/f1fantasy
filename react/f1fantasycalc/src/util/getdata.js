export async function getData() {
    let result = {activeDrivers: [], activeTeams: [], allDrivers: [], allTeams: []};
    try {
        let constructorResponse = await fetch('./constructors.json');
        let constructorJson = await constructorResponse.json();
        constructorJson.forEach(team => {
            result.allTeams.push(team);
            if (team.active) {
                result.activeTeams.push(team);
            }
        });
    } catch (error) {
        //TODO ui error reporting
        console.log('Error getting constructor data: ' + error);
        return;
    }
    try {
        let driverResponse = await fetch('./drivers.json');
        let driverJson = await driverResponse.json();
        driverJson.forEach(driver => {
            result.allDrivers.push(driver);
            if (driver.active) {
                result.activeDrivers.push({
                    //use only fields we need plus add predicted position
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
        //TODO ui error reporting
        console.log('Error getting driver data: ' + error);
        return;
    }
    return result;
}