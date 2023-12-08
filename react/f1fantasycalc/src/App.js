//import './App.scss';
import TestList from './reorderable-list/list.js';

function App() {
  return (
    /* TITLE BAR */
    <div className="App d-flex flex-column">
      <div className="flex-grow-1" style={{height: '5rem', backgroundColor: 'black'}}>
        <div className="ms-4 text-start">
          <span className="pageTitle" style={{color: 'red', fontStyle: 'italic'}}>F1</span>
          <span className="ms-3 pageTitle" style={{color: 'white'}}>Fantasy Calculator</span>
        </div>
      </div>
      {/* SAVE AND LOAD BUTTONS */}
      <div>
        <button className="btn btn-lg btn-primary"><i className="bi-save"></i> Save</button>
        <button className="btn btn-primary"><i className="bi-upload"></i> Load</button>
      </div>

      {/* PREDICTED ORDER LIST */}
      <div >
        <TestList style={{width: '50px'}}/>
      </div>
    </div>
  );
}

export default App;