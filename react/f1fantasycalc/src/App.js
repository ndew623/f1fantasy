//import './App.scss';
import { useState } from 'react';
import OrderableList from './orderable-list/OrderableList.js';

function App() {
  const [names, setNames] = useState(["Max Verstappen", "Sergio Perez", "Lewis Hamilton", "George Russell", "Charles Leclerc", "Carlos Sainz", "Pierre Gasly", "Esteban Ocon", "Daniel Ricciardo", "Yuki Tsunoda", "Lando Norris", "Oscar Piastri", "Alex Albon", "Logan Sergeant", "Kevin Magnussen", "Nico Hulkenberg", "Fernando Alonso", "Lance Stroll", "Valteri Bottas", "Zhou Guanyu"]);
  const [constructors, setConstructors] = useState(["Red Bull", "Mercedes", "Ferrari", "McLaren", "Alpha Tauri", "Alpine", "Aston Martin", "Alfa Romeo", "Williams", "Haas" ]);
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
          <h2 className="mt-2">Previous round picks:</h2>
          <div className="d-flex flex-row mt-2 ms-1">
            <div className="d-flex flex-column PrevPicksColumn">
              <h3 className="mb-1">Driver Picks</h3>
              {names.map((name, index) => (
                <div key={index} className="form-check">
                  <input className="form-check-input" type="checkbox" id={`driver-${index}`}/>
                  <label className="form-check-label" htmlFor={`driver-${index}`}>{name}</label>
                </div>
              ))}
            </div>
            <div className="d-flex flex-column PrevPicksColumn">
              <h3 className="mb-1">Constructor Picks</h3>
              {constructors.map((name, index) => (
                <div key={index} className="form-check">
                  <input className="form-check-input" type="checkbox" id={`constructor-${index}`}/>
                  <label className="form-check-label" htmlFor={`constructor-${index}`}>{name}</label>
                </div>
              ))}
            </div>
          </div>

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

export default App;