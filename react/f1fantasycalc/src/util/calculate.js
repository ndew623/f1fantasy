const closePointsThreshold = 5;
//return {drivers, teams, expectedPoints, cost}
export function getPicks(costCap, numFreeTransfers, prevDriverPicks, prevConstructorPicks, activeDrivers, activeConstructors, predOrder) {
    let candidateDriverChoice = {driverindices: [0,1,2,3,3], cost: 0.0};
    let candidateConstructorChoice = {constructorindices: [0,0], cost: 0.0};
    let bestChoice = {driverindices: [], constructorindices: [], cost: 0.0, expectedPoints: 0.0};
    let samePointsChoices = [];
    let closePointsChoices = [];

    //try all teams combinations
    while(!arraysEqual(candidateConstructorChoice.constructorindices, [activeConstructors.length-2, activeConstructors.length-1])) {//while candidate constructor choice is not already last possible option
        candidateDriverChoice = {driverindices: [0,1,2,3,3], cost: 0.0};//reset driver choice to check all driver combos for each constructor choice
        candidateConstructorChoice = getNextConstructorChoice(candidateConstructorChoice, activeConstructors);
        //for each team, try all driver combinations
        while (!arraysEqual(candidateDriverChoice.driverindices, [activeDrivers.length-4, activeDrivers.length-3, activeDrivers.length-2, activeDrivers.length-1, activeDrivers.length-1])) {//while candidate driver choice is not already last possible option
            candidateDriverChoice = getNextDriverChoice(candidateDriverChoice, activeDrivers);
            let totalcost = candidateDriverChoice.cost + candidateConstructorChoice.cost;
            if (totalcost <= costCap) {
                //TODO evaluate choice
            }
        }
    }
    return {};
}
function getNextDriverChoice(driverChoice, activeDrivers) {
    return {};//TODO implement
}
function getNextConstructorChoice(constructorChoice, activeConstructors) {
    return {};//TODO implement
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