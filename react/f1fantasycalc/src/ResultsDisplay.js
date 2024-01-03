import { useState, useEffect } from 'react';
import { closePointsThreshold } from './util/calculate';

export function ResultsDisplay({ results }) {
    const [picksText, setPicksText] = useState("");
    useEffect(() => {
        if (results.hasOwnProperty("samePoints")) {
            //displayResults(results, setPicksText);
        }

    }, [results]);
    if (results.hasOwnProperty("best")) {
        console.log("results has best");
        console.log(results.best);
        let bestCard = Card(results.best);
        let samePointsSplit = splitArray(results.samePoints, 3);
        let closePointsSplit = splitArray(results.closePoints, 3);
        return (
            <div>
                <h2>Most points, most budget</h2>
                <table>
                <tbody>
                    <tr>
                        <td>
                            {bestCard}
                        </td>
                    </tr>
                </tbody>
                </table>
                <h2>Most points, less budget</h2>
                <table>
                <tbody>
                    {samePointsSplit.map((picks, index) => {
                        return (
                            <tr key={index}>
                                {picks.map((picks, index) => {
                                    return (
                                        <td key={index}>
                                            {Card(picks)}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
                </table>
                <h2>Close to most points</h2>
                <table>
                <tbody>
                    {closePointsSplit.map((picks, index) => {
                        return (
                            <tr key={index}>
                                {picks.map((picks, index) => {
                                    return (
                                        <td key={index}>
                                            {Card(picks)}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
                </table>
            </div>
         );
    } else {
        return;
    }
}

function Card(picks) {
    return (
        <div className="card">
            <div className="card-body">
                <pre>{getPicksDisplayString(picks)}</pre>
            </div>
        </div>
    )
}

function splitArray(a, length) {
    let result = [];
    for (let i = 0; i < a.length; i += length) {
        result.push(a.slice(i, i + length));
    }
    return result;
}

function displayResults(results, setPicksText) {
    let bestpicks = results.best;

    let displayText = "Highest points with most budget spent:\n";
    displayText += "----------------------------------------\n";
    displayText += getPicksDisplayString(bestpicks);

    let altPickCount = 1;
    results.samePoints.forEach(picks => {
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
    picksText += "Expected points: " + picks.expectedPoints + "\n";
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