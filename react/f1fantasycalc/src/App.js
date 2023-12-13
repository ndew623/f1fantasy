//import './App.scss';
import { getData } from './util/getdata.js';
import { useState } from 'react';
import OrderableList from './orderable-list/OrderableList.js';
import { PreviousPicks } from './PreviousPicks.js';

function App() {
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [activeConstructors, setActiveConstructors] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [allConstructors, setAllConstructors] = useState([]);
  getDriversAndConstructors(setActiveDrivers, setActiveConstructors, setAllDrivers, setAllConstructors);
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
          $<input type="text" className="form-control CostCapInput" /> <span class="ms-1">M</span>
        </div>
        {/*CALC SWAP PENALTIES*/}
        <h1 className="text-start mt-3">2. Calculate swap penalties</h1>
        <div className="d-flex flex-column ms-4">
          <div>
            <input type="checkbox" className="form-check-input LargeCheckbox" id="includeSwapPenaltiesCheckbox" />
            <label className="form-check-label ms-2" htmlFor="includeSwapPenaltiesCheckbox" >Include swap penalties</label>
          </div>
          {/*NUM FREE TRANSFERS*/}
          <div className="d-flex flex-row align-items-center mt-2">
            <h2>Number of free transfers: </h2>
            <input type="text" className="form-control FreeTransfersInput ms-2" />
          </div>
          {/*PREV PICKS*/}
          <PreviousPicks drivers={allDrivers} constructors={allConstructors} />

        </div>
        {/* PREDICTED ORDER LIST */}
        <h1 className="text-start mt-3">3. Predict race finish</h1>
        <div className="mt-2 me-auto">
          <OrderableList style={{ width: '50px' }} />
        </div>
      </div>
    </div>
  );
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