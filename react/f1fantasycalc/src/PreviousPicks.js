export function PreviousPicks({drivers, constructors}) {
    return (
        <div>
            <h2 className="mt-2">Previous round picks:</h2>
            <div className="d-flex flex-row mt-2 ms-1">
            <div className="d-flex flex-column PrevPicksColumn">
                <h3 className="mb-1">Driver Picks</h3>
                {drivers.map((driver, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" id={`driver-${index}`}/>
                    <label className="form-check-label" htmlFor={`driver-${index}`}>{driver.name}</label>
                </div>
                ))}
            </div>
            <div className="d-flex flex-column PrevPicksColumn">
                <h3 className="mb-1">Constructor Picks</h3>
                {constructors.map((constructor, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" id={`constructor-${index}`}/>
                    <label className="form-check-label" htmlFor={`constructor-${index}`}>{constructor.name}</label>
                </div>
                ))}
            </div>
            </div>
        </div>
    );
}