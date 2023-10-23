const placepointsmap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const closePointsThreshold = 5;

var costcap = 100.0;
var currDriverPicks = [];
var currTeamPicks = [];

//return {drivers, teams, expectedpoints, cost}
function getBestPicks() {
	let driverchoice = { driverindexes: [0,1,2,3,3], cost: 0.0 };
	let teamchoice = { teamindexes: [0,0], cost: 0.0} ;

	let bestchoice = { driverindexes: [], teamindexes: [], expectedpoints: 0, cost: 0.0};
	let samePointsChoices = [];
	let closePointsChoices = [];

	while (!arraysEqual(teamchoice.teamindexes, [allteams.length-2,allteams.length-1])) {//while teamchoice not already last two teams to check
		driverchoice = { driverindexes: [0,1,2,3,3], cost: 0.0 };//reset driver choice for checking all driver combos with a new team selection
		teamchoice = getNextTeams(teamchoice);
		while (!arraysEqual(driverchoice.driverindexes, [alldrivers.length-5, alldrivers.length-4, alldrivers.length-3, alldrivers.length-2, alldrivers.length-1])) {//while driver choice is not the last driver combo to check
			driverchoice = getNextDrivers(driverchoice);
			totalcost = driverchoice.cost + teamchoice.cost;
			if (totalcost <= costcap) {
				let expectedpoints = calcExpectedPoints(driverchoice.driverindexes, teamchoice.teamindexes, driverchoice.DRSdriverindex);
				candidatechoice = {driverindexes: driverchoice.driverindexes, teamindexes: teamchoice.teamindexes, expectedpoints: expectedpoints, cost: totalcost, DRSdriverindex: driverchoice.DRSdriverindex};
				if (expectedpoints > bestchoice.expectedpoints) {
					closePointsChoices = recheckClosePointsChoices(expectedpoints, closePointsChoices);//new best choice, recheck that list of near best choices are still near the best choice
					if (bestchoice.expectedpoints >= expectedpoints-closePointsThreshold) {//if the old best choice is still close to as good, save it
						closePointsChoices.push(bestchoice);
					}
					bestchoice = candidatechoice;
					samePointsChoices = [];
				} else if (expectedpoints == bestchoice.expectedpoints) {
					if (totalcost > bestchoice.cost) {
						samePointsChoices.push(bestchoice);
						bestchoice = candidatechoice;
					} else {
						samePointsChoices.push(candidatechoice)
					}
				} else if (expectedpoints >= bestchoice.expectedpoints - closePointsThreshold) {//if not as good as or equal to best choice, see if it's close
					closePointsChoices.push(candidatechoice);
				}
			}
		}
	}

	closePointsChoices.sort((a, b)=>{
		if (a.expectedpoints > b.expectedpoints) {
			return -1;
		} else if (a.expectedpoints < b.expectedpoints) {
			return 1
		} else if (a.cost > b.cost) {
			return -1;
		} else if (a.cost < b.cost) {
			return 1;
		}
		return 0;
	});
	return { best: bestchoice, samepoints: samePointsChoices, closePoints: closePointsChoices };
}

function recheckClosePointsChoices(bestpoints, closePoints) {
	return closePoints.filter(element => {
		return element.expectedpoints >= bestpoints-closePointsThreshold;
	});
}

function getNextTeams(prevteams) {
	teamChoiceArray = prevteams.teamindexes.concat([allteams.length]);
	let newTeamChoiceArray = incrementArrayNoRepeats(teamChoiceArray);
	let newteams = { teamindexes: newTeamChoiceArray, cost: 0.0 };
	newteams.teamindexes.forEach(teamindex => {newteams.cost += allteams[teamindex].cost});
	return newteams;
}

function getNextDrivers(prevdrivers) {
	driverChoiceArray = prevdrivers.driverindexes.concat([alldrivers.length]);
	let newDriverChoiceArray = incrementArrayNoRepeats(driverChoiceArray);
	let newdrivers = { driverindexes: newDriverChoiceArray, cost: 0.0, DRSdriverindex: -1 };
	//add up cost and set drs on driver with most points
	let bestFinishPos = alldrivers[newdrivers.driverindexes[0]].predpos;
	newdrivers.DRSdriverindex = newdrivers.driverindexes[0];
	newdrivers.driverindexes.forEach( driverindex => {
		let cost = alldrivers[driverindex].cost
		newdrivers.cost += cost;
		if (alldrivers[driverindex].predpos < bestFinishPos) {//if driver has a better finish, give DRS
			bestFinishPos = alldrivers[driverindex].predpos;
			newdrivers.DRSdriverindex = driverindex;
		} else if (alldrivers[driverindex].predpos === bestFinishPos && alldrivers[newdrivers.DRSdriverindex].cost > cost) {//if driver finish pos is equal but driver is more expensive, give DRS
			bestFinishPos = alldrivers[driverindex].predpos;
			newdrivers.DRSdriverindex = driverindex;
		}
	});
	return newdrivers;
}


//increment an array for the purpose of reaching all no-repeats order-doesn't-matter combinations
//final element of the array is the number of possible choices
//to increment, each value at i increases until it's one below the value at i+1
//when i increases, the values after i are changed to be a[i]+1, a[i+1]+1, a[i+2]+1... except the last element because it's just the number of possible choices and shouldn't change
function incrementArrayNoRepeats(a) {
	a = [...a];
	for (let i = a.length-2; i >= 0; i--) {
		if (a[i] < a[i+1]-1) {
			a[i] += 1;
			for(let j = i+1; j < a.length-1; j++) {
				a[j] = a[j-1]+1;
			}
			return a.slice(0, a.length-1);//incremented. slice off number of possible choices value at end
		}
	}
	return a.slice(0, a.length-1);//already at last value, no change. slice off number of possible choices value at end
}

function calcExpectedPoints(driverindexes, teamindexes, DRSdriverindex) {
	drspoints = placepointsmap[alldrivers[DRSdriverindex].predpos-1];
	return calcDriversPoints(driverindexes) + calcTeamsPoints(teamindexes) + drspoints - calcTransferPenalty(driverindexes, teamindexes);
}

function calcDriversPoints(driverindexes) {
	let totalPoints = 0;
	driverindexes.forEach(driverindex => {
		driver = alldrivers[driverindex];
		if (driver.predpos <= placepointsmap.length) {
			totalPoints += placepointsmap[driver.predpos-1];
		} else {
			totalPoints += 0;//NOTE: could adjust from 0 to have some < 1 weight. to make 11th being better than 20th for example
		}
	});
	return totalPoints;
}

function calcTeamsPoints(teamindexes) {
	let totalPoints = 0;
	teamindexes.forEach(teamindex => {
		team = allteams[teamindex];
		teamdrivers = [];
		for (let i = 0; i < alldrivers.length; i++) {
			if (alldrivers[i].teamid === team.id) {
				teamdrivers.push(i);
			}
		}
		totalPoints += calcDriversPoints(teamdrivers);
	});
	return totalPoints;
}

//https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function calcTransferPenalty(driverindexes, teamindexes) {
	return transferPenalties(getNumTransfers(driverindexes, teamindexes));
}

function transferPenalties(numtransfers) {
	if (numtransfers < 2) {
		return 0;
	}
	return (numtransfers-2)*4;
}

function getNumTransfers(driverindexes, teamindexes) {
	numtransfers = 0;
	currDriverPicks.forEach(driverid=>{
		let isTransfer = true;
		driverindexes.forEach(driverindex=>{
			if (alldrivers[driverindex].id === driverid) {
				isTransfer = false;
			}
		});
		if(isTransfer) {
			numtransfers++;
		}
	});
	currTeamPicks.forEach(teamid=>{
		let isTransfer = true;
		teamindexes.forEach(teamindex=>{
			if (allteams[teamindex].id === teamid) {
				isTransfer = false;
			}
		});
		if (isTransfer) {
			numtransfers++;
		}
	});
	return numtransfers;
}
