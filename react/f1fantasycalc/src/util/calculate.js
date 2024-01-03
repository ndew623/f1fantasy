import { posToPoints } from "./points";
export const closePointsThreshold = 5;
//return {drivers, teams, expectedPoints, cost}
export function getPicks(costCap, accountForTransferPenalties, numFreeTransfers, prevDriverPicks, prevConstructorPicks, activeDrivers, activeConstructors, predOrder) {
    let candidateDriverChoice = {driverindices: [0,1,2,3,3], cost: 0.0};
    let candidateConstructorChoice = {constructorindices: [0,0], cost: 0.0};
    let bestChoice = {driverindices: [], constructorindices: [], cost: 0.0, expectedPoints: 0.0};
    let samePointsChoices = [];
    let closePointsChoices = [];

    //try all teams combinations
    while(!arraysEqual(candidateConstructorChoice.constructorindices, [activeConstructors.length-2, activeConstructors.length-1])) {//while candidate constructor choice is not already last possible option
        candidateDriverChoice = {driverindices: [0,1,2,3,3], cost: 0.0, DRSdriverindex: 0};//reset driver choice to check all driver combos for each constructor choice
        candidateConstructorChoice = getNextConstructorChoice(candidateConstructorChoice, activeConstructors);
        //for each team, try all driver combinations
        while (!arraysEqual(candidateDriverChoice.driverindices, [activeDrivers.length-5, activeDrivers.length-4, activeDrivers.length-3, activeDrivers.length-2, activeDrivers.length-1])) {//while candidate driver choice is not already last possible option
            candidateDriverChoice = getNextDriverChoice(candidateDriverChoice, activeDrivers, predOrder);
            let totalcost = candidateDriverChoice.cost + candidateConstructorChoice.cost;
            if (totalcost <= costCap) {
                let points = calcExpectedPoints(
                    candidateDriverChoice.driverindices,
                    candidateConstructorChoice.constructorindices,
                    predOrder,
                    candidateDriverChoice.DRSdriverindex,
                    accountForTransferPenalties,
                    prevDriverPicks,
                    prevConstructorPicks,
                    numFreeTransfers,
                    activeDrivers,
                    activeConstructors);
                let expectedPoints = points.net;
                let candidateChoice = {
                    driverindices: candidateDriverChoice.driverindices,
                    constructorindices: candidateConstructorChoice.constructorindices,
                    cost: totalcost,
                    expectedPoints: expectedPoints,
                    DRSdriverindex: candidateDriverChoice.DRSdriverindex,
                    transferPenaltyPoints: points.transferPenalty,
                    numTransfers: points.numTransfers
                };
                if (expectedPoints > bestChoice.expectedPoints) {
                    //when there is a new, better best choice, recheck the list of close to best choices
                    closePointsChoices = closePointsChoices.filter(choice => choice.expectedPoints >= (expectedPoints - closePointsThreshold));
                    //if the old bestchoice was close to the new best choice, add it to the list of close to best choices
                    if (bestChoice.expectedPoints > expectedPoints-closePointsThreshold) {
                        closePointsChoices.push(bestChoice);
                    }
                    bestChoice = candidateChoice;
                    samePointsChoices = [];
                } else if (expectedPoints === bestChoice.expectedPoints) {
                    //if the points are equal, choose the one that costs more, add the other to the list of same points choices
                    if (totalcost > bestChoice.cost) {
                        samePointsChoices.push(bestChoice);
                        bestChoice = candidateChoice;
                    } else {
                        samePointsChoices.push(candidateChoice);
                    }
                } else if (expectedPoints >= (bestChoice.expectedPoints - closePointsThreshold)) {
                    closePointsChoices.push(candidateChoice);
                }
            }
        }
    }

    closePointsChoices.sort((a,b) => {
        if (a.expectedPoints > b.expectedPoints) return -1;
        else if (a.expectedPoints < b.expectedPoints) return 1;
        else if (a.cost > b.cost) return -1;
        else if (a.cost < b.cost) return 1;
        else return 0;
    });

    //convert indices of drivers and constructors to objects with all necessary info to be displayed
    let result = {best: convertIndicesToObjects(bestChoice, predOrder, activeDrivers, activeConstructors), samePoints: [], closePoints: []};
    result.samePoints = samePointsChoices.map(choice => convertIndicesToObjects(choice, predOrder, activeDrivers, activeConstructors));
    result.closePoints = closePointsChoices.map(choice => convertIndicesToObjects(choice, predOrder, activeDrivers, activeConstructors));
    return result;
}

function convertIndicesToObjects(candidateChoice, predOrder, activeDrivers, activeConstructors) {
    let result = {
        drivers: [],
        constructors: [],
        expectedPoints: candidateChoice.expectedPoints,
        cost: candidateChoice.cost,
        transferPenaltyPoints: candidateChoice.transferPenaltyPoints,
        numTransfers: candidateChoice.numTransfers
    };
    result.drivers = candidateChoice.driverindices.map(index => {
        let driver = activeDrivers[index];
        driver.isDrsDriver = candidateChoice.DRSdriverindex === index;
        driver.points = posToPoints(posFromId(driver.id, predOrder));
        return driver;
    });
    result.constructors = candidateChoice.constructorindices.map(index => {
        let constructor = activeConstructors[index];
        constructor.points = calcConstructorPoints([index], predOrder, activeDrivers, activeConstructors);
        return constructor;
    });
    return result;
}

function getNextDriverChoice(driverChoice, activeDrivers, predOrder) {
    let driverChoiceArray = driverChoice.driverindices.concat([activeDrivers.length]);
    let newDriverChoiceArray = incrementArrayNoRepeats(driverChoiceArray);
    let newDriverChoice = {driverindices: newDriverChoiceArray, cost: 0.0, DRSdriverindex: -1};
    let bestFinishPos = posFromId(activeDrivers[newDriverChoice.driverindices[0]].id, predOrder);
    newDriverChoice.DRSdriverindex = newDriverChoice.driverindices[0];
    //add up cost and choose DRS driver
    newDriverChoice.driverindices.forEach(index => {
        let cost = activeDrivers[index].cost;
        let predpos = posFromId(activeDrivers[index].id, predOrder);
        newDriverChoice.cost += cost;
        if (predpos < bestFinishPos) {//if finish position is better, choose that driver for DRS
            bestFinishPos = predpos;
            newDriverChoice.DRSdriverindex = index;
        } else if (predpos === bestFinishPos && activeDrivers[index].cost > cost) {//if finish position is the same, choose the more expensive driver for DRS
            bestFinishPos = predpos;
            newDriverChoice.DRSdriverindex = index;
        }
    });
    return newDriverChoice;
}
function getNextConstructorChoice(constructorChoice, activeConstructors) {
    let constructorChoiceArray = constructorChoice.constructorindices.concat([activeConstructors.length]);
    let newConstructorChoiceArray = incrementArrayNoRepeats(constructorChoiceArray);
    let newConstructors = {constructorindices: newConstructorChoiceArray, cost: 0.0};
    newConstructors.constructorindices.forEach(index => {newConstructors.cost += activeConstructors[index].cost});
    return newConstructors;
}

//increment an array for the purpose of reaching all no-repeats order-doesn't-matter combinations
//final element of the array is the number of possible choices
//to increment, each value at i increases until it's one below the value at i+1
//when i increases, the values after i are changed to be a[i]+1, a[i+1]+1, a[i+2]+1... except the last element because it's just the number of possible choices and shouldn't change
function incrementArrayNoRepeats(a) {
    a = [...a];
    for (let i = a.length-2; i >= 0; i--) {
        if (a[i] < a[i+1]-1) {
            a[i]++;
            for (let j = i+1; j < a.length; j++) {
                a[j] = a[j-1]+1;
            }
            return a.slice(0, a.length-1);
        }
    }
    return a.slice(0, a.length-1); //at last value, no change
}
function calcExpectedPoints(driverindices, constructorindices, predOrder, DRSdriverindex, accountForTransferPenalties, prevDriverPicks, prevConstructorPicks, numFreeTransfers, activeDrivers, activeConstructors) {
    let drspoints = posToPoints(posFromId(activeDrivers[DRSdriverindex].id, predOrder));
    let driverPoints = calcDriverPoints(driverindices, predOrder, activeDrivers);
    let constructorPoints = calcConstructorPoints(constructorindices, predOrder, activeDrivers, activeConstructors);
    let points = driverPoints + constructorPoints + drspoints;
    let transferPenalty = {points: 0, numTransfers: 0};
    if (accountForTransferPenalties) {
        transferPenalty = calcTransferPenalty(activeDrivers, activeConstructors, driverindices, constructorindices, prevDriverPicks, prevConstructorPicks, numFreeTransfers);
    }
    points -= transferPenalty.points;
    return {net: points, transferPenalty: transferPenalty.points, numTransfers: transferPenalty.numTransfers};
}
function calcDriverPoints(driverindex, predOrder, activeDrivers) {
    let totalpoints = 0;
    driverindex.forEach(index => {
        let pos = posFromId(activeDrivers[index].id, predOrder);
        totalpoints += posToPoints(pos);
    });
    return totalpoints;
}
function calcConstructorPoints(constructorindex, predOrder, activeDrivers, activeConstructors) {
    let totalpoints = 0;
    constructorindex.forEach(index => {
        let constructor = activeConstructors[index];
        let drivers = [];
        for (let i = 0; i < activeDrivers.length; i++) {
            if (activeDrivers[i].teamid === constructor.id) {
                drivers.push(i);
            }
        }
        totalpoints += calcDriverPoints(drivers, predOrder, activeDrivers);
    });
    return totalpoints;
}

function calcTransferPenalty(activeDrivers, activeConstructors, driverindices, constructorindices, prevDriverPicks, prevConstructorPicks, numFreeTransfers) {
    let numTransfers = getNumTransfers(activeDrivers, activeConstructors, driverindices, constructorindices, prevDriverPicks, prevConstructorPicks);
    return {points: transferPenaltyPoints(numTransfers, numFreeTransfers), numTransfers: numTransfers};
}

function transferPenaltyPoints(numtransfers, numFreeTransfers) {
    if (numtransfers < numFreeTransfers) {
        return 0;
    }
    return (numtransfers - numFreeTransfers) * 4;
}

function getNumTransfers(activeDrivers, activeConstructors, driverindices, constructorindices, prevDriverPicks, prevConstructorPicks) {
    let numtransfers = 0;
    prevDriverPicks.forEach(driverId => {
        let isTransfer = true;
        driverindices.forEach(index => {
            if (driverId === activeDrivers[index].id) {
                isTransfer = false;
            }
        });
        if (isTransfer) {
            numtransfers++;
        }
    });
    prevConstructorPicks.forEach(constructorId => {
        let isTransfer = true;
        constructorindices.forEach(index => {
            if (constructorId === activeConstructors[index].id) {
                isTransfer = false;
            }
        });
        if (isTransfer) {
            numtransfers++;
        }
    });
    return numtransfers;
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
//https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
/*function arraysEqual(a, b) {
  console.log("arraysEqual: a="+a+" b="+b);
  if (a === b) {
    console.log("    true 1");
    return true;
  }
  if (a == null || b == null) {
    console.log("    false 1");
    return false;
  }
  if (a.length !== b.length) {
    console.log("    false 2");
    return false;
  }

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
        console.log("    false 3");
        return false;
    }
  }
  console.log("    true 2");
  return true;
}*/

function posFromId(id, predOrder) {
    let result = predOrder.findIndex(driverId => {
        return driverId === id;
    });
    return result+1;
}