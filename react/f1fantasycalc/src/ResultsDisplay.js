import { useState, useEffect } from 'react';
import { closePointsThreshold } from './util/calculate';

export function ResultsDisplay({ results }) {
    const [picksText, setPicksText] = useState("");
    useEffect(() => {
        //TODO doesn't display
        if (results.hasOwnProperty("samepoints")) {
            displayResults(results, setPicksText);
        }

    }, [results]);
    return (<pre>{picksText}</pre>)
}

function displayResults(results, setPicksText) {
    let bestpicks = results.best;

    let displayText = "Highest points with most budget spent:\n";
    displayText += "----------------------------------------\n";
    displayText += getPicksDisplayString(bestpicks);

    let altPickCount = 1;
    results.samepoints.forEach(picks => {
        displayText += "\n\nHighest points alternate pick #" + altPickCount + "\n";
        displayText += "----------------------------------------\n";
        displayText += getPicksDisplayString(picks);
        altPickCount++;
    });

    let closePickCount = 1;
    results.closePoints.forEach(picks => {
        displayText += "\n\nClose to most points pick #" + closePickCount + " (Within " + closePointsThreshold + " points)\n";
        displayText += "----------------------------------------\n";
        displayText += getPicksDisplayString(picks);
        closePickCount++;
    });

    setPicksText(displayText);
}

function getPicksDisplayString(picks) {
    let picksText = "";
    picksText += "Expected points: " + picks.expectedpoints + "\n";
    picksText += "Cost: " + picks.cost + "\n";
    picksText += "Num Transfers: " + picks.numTransfers;
    if (picks.transferPenaltyPoints > 0) {
        picksText += " (-" + picks.transferPenaltyPoints + " points)";
    }
    picksText += '\n';
    picksText += "Drivers:\n";
    picks.drivers.forEach(driver => {
        let points = driver.points;
        if (driver.isDrsDriver) {
            points *= 2;
        }
        picksText += "    " + driver.name + ". Points: " + points;
        picksText += ". Cost: " + driver.cost;
        if (driver.isDrsDriver) {
            picksText += " (DRS 2x)";
        }
        picksText += "\n";
    });
    picksText += "Teams:\n";
    picks.constructors.forEach(constructor => {
        picksText += "    " + constructor.name + ". Score: " + constructor.points + ". Cost: " + constructor.cost + "\n";
    });
    return picksText;
}