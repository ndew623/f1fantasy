//import './App.scss';
import TestList from './reorderable-list/list.js';

function App() {
  return (
    <div className="d-flex flex-column">
      {/* TITLE BAR */}
      <div className="flex-grow-1" style={{height: '5rem', backgroundColor: 'black'}}>
        <div className="ms-4 text-start">
          <span className="pageTitle" style={{color: 'red', fontStyle: 'italic'}}>F1</span>
          <span className="ms-3 pageTitle" style={{color: 'white'}}>Fantasy Calculator</span>
        </div>
      </div>
      <div className="d-flex flex-column ms-2">
        {/* SAVE AND LOAD BUTTONS */}
        <div className="d-flex flow-row mt-3">
          <button className="btn btn-lg btn-primary ms-2"><i className="bi-save"></i> Save</button>
          <button className="btn btn-lg btn-primary ms-2"><i className="bi-upload"></i> Load</button>
        </div>

        {/*Enter cost cap*/}
        <h1 className="text-start mt-3">1. Enter cost cap</h1>
        <div className="d-flex flex-row align-items-center CostCapInputLabelBold ms-4">
          $<input type="text" className="form-control CostCapInput"/> <span class="ms-1">M</span>
        </div>
        {/*Calc swap penalties*/}
        <h1 className="text-start mt-3">2. Calculate swap penalties</h1>
        <div className="d-flex flex-column ms-4">
          <div>
            <input type="checkbox" className="form-check-input LargeCheckbox" id="includeSwapPenaltiesCheckbox"/>
            <label className="form-check-label ms-2" for="includeSwapPenaltiesCheckbox" >Include swap penalties</label>
          </div>

        </div>
        {/* PREDICTED ORDER LIST */}
        <div >
          <TestList style={{width: '50px'}}/>
        </div>
      </div>
    </div>
  );
}

export default App;