//import './App.scss';
import { getData } from './util/getdata.js';
import { useState, useEffect } from 'react';
import OrderableList from './orderable-list/OrderableList.js';
import { PreviousPicks } from './PreviousPicks.js';
import { ResultsDisplay } from './ResultsDisplay.js';
import { getPicks } from './util/calculate.js';

function App() {
  const [costCap, setCostCap] = useState(100);
  const [numFreeTransfers, setNumFreeTransfers] = useState(2);
  //TODO swap penalties -> transfer penalties
  const [includeSwapPenalties, setIncludeSwapPenalties] = useState(true);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [activeConstructors, setActiveConstructors] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [allConstructors, setAllConstructors] = useState([]);
  const [prevDriverPicks, setPrevDriverPicks] = useState([]);
  const [prevConstructorPicks, setPrevConstructorPicks] = useState([]);
  const [predOrder, setPredOrder] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(() => {
    getDriversAndConstructors(setActiveDrivers, setActiveConstructors, setAllDrivers, setAllConstructors);
  }, []);


  return (
    <div className="d-flex flex-column">
      {/* TITLE BAR */}
      <div className="flex-grow-1" style={{ height: '5rem', backgroundColor: 'black' }}>
        <div className="ms-4 text-start">
          <span className="pageTitle" style={{ color: 'red', fontStyle: 'italic' }}>F1</span>
          <span className="ms-3 pageTitle" style={{ color: 'white' }}>Fantasy Calculator</span>
        </div>
      </div>
      <div className="d-flex flex-column ms-2">
        {/* SAVE AND LOAD BUTTONS */}
        <div className="d-flex flow-row mt-3">
          <button className="btn btn-lg btn-primary ms-2"><i className="bi-save"></i> Save</button>
          <button className="btn btn-lg btn-primary ms-2"><i className="bi-upload"></i> Load</button>
        </div>

        {/*COST CAP*/}
        <h1 className="text-start mt-3">1. Enter cost cap</h1>
        <div className="d-flex flex-row align-items-center CostCapInputLabelBold ms-4">
          $<input type="text" className="form-control CostCapInput" value={costCap} onChange={e => setCostCap(e.target.value)} onBlur={e => costCapInputBlur(e.target.value, setCostCap)}/> <span className="ms-1">M</span>
        </div>
        {/*CALC SWAP PENALTIES*/}
        <h1 className="text-start mt-3">2. Calculate swap penalties</h1>
        <div className="d-flex flex-column ms-4">
          <div>
            <input type="checkbox" className="form-check-input LargeCheckbox" id="includeSwapPenaltiesCheckbox" checked={includeSwapPenalties} onChange={e=>setIncludeSwapPenalties(e.target.checked)}/>
            <label className="form-check-label ms-2" htmlFor="includeSwapPenaltiesCheckbox">Include swap penalties</label>
          </div>
          {/*NUM FREE TRANSFERS*/}
          { includeSwapPenalties ? (
            <div>
              <div className="d-flex flex-row align-items-center mt-2">
              <h2>Number of free transfers: </h2>
              <input type="text" className="form-control FreeTransfersInput ms-2" value={numFreeTransfers} onChange={e => setNumFreeTransfers(e.target.value)} onBlur={e => numFreeTransfersInputBlur(e.target.value, setNumFreeTransfers)}/>
            </div>
            <PreviousPicks drivers={allDrivers} constructors={allConstructors} onChange={(driverPicks, constructorPicks) => onPrevPicksChange(driverPicks, constructorPicks, setPrevDriverPicks, setPrevConstructorPicks)}/>
            </div>
          ): null}

        </div>
        {/* PREDICTED ORDER LIST */}
        <h1 className="text-start mt-3">3. Predict race finish</h1>
        <div className="mt-2 me-auto">
          <OrderableList drivers={activeDrivers} onChange={predOrder=>onPredOrderChange(predOrder, setPredOrder)} style={{ width: '50px' }} />
        </div>
        {/* RESULTS */}
        <h1 className="text-start mt-3">4. Calculate best picks</h1>
        <div className="pb-3">
          <ResultsDisplay results={results} />
          <button className="btn btn-lg btn-primary ms-4" onClick={e => calculateButtonClicked(costCap, includeSwapPenalties, numFreeTransfers, prevDriverPicks, prevConstructorPicks, predOrder, activeDrivers, activeConstructors, setResults)}><i className="bi-calculator"></i> Calculate</button>
        </div>
      </div>
    </div>
  );
}

function calculateButtonClicked(costCap, includeSwapPenalties, numFreeTransfers, prevDriverPicks, prevConstructorPicks, predOrder, activeDrivers, activeConstructors, setResults) {
  let result = getPicks(costCap, includeSwapPenalties, numFreeTransfers, prevDriverPicks, prevConstructorPicks, activeDrivers, activeConstructors, predOrder);
  setResults(result);
}

function costCapInputBlur(costcapstring, setCostCap) {
  let costcapvalue = 0.0;
  if (costcapstring.length > 0) {
    costcapvalue = parseFloat(costcapstring);
  }
  if (isNaN(costcapvalue)) {
    costcapvalue = 0.0;
  } else if (costcapvalue < 0.0) {
    costcapvalue = 0.0;
  }
  setCostCap(costcapvalue);
}

function numFreeTransfersInputBlur(numFreeTransfersString, setNumFreeTransfers) {
  let numFreeTransfersValue = 0;
  if (numFreeTransfersString.length > 0) {
    numFreeTransfersValue = parseInt(numFreeTransfersString);
  }
  if (isNaN(numFreeTransfersValue)) {
    numFreeTransfersValue = 0;
  } else if (numFreeTransfersValue < 0) {
    numFreeTransfersValue = 0;
  }
  setNumFreeTransfers(numFreeTransfersValue);
}

function onPrevPicksChange(driverPicks, constructorPicks, setPrevDriverPicks, setPrevConstructorPicks) {
  setPrevDriverPicks(driverPicks);
  setPrevConstructorPicks(constructorPicks);
}

function onPredOrderChange(predOrder, setPredOrder) {
  setPredOrder(predOrder);
}

async function getDriversAndConstructors(setActiveDrivers, setActiveConstructors, setAllDrivers, setAllConstructors) {
  await getData().then(result => {
    setActiveDrivers(result.activeDrivers);
    setActiveConstructors(result.activeTeams);
    setAllDrivers(result.allDrivers);
    setAllConstructors(result.allTeams);
  });
}

export default App;