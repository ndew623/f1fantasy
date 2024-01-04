import { useState, useEffect } from 'react';
export function PreviousPicks({drivers, constructors, prevDriverPicks, prevConstructorPicks, onChange}) {
    const [driverPicks, setDriverPicks] = useState([]);
    const [constructorPicks, setConstructorPicks] = useState([]);

    useEffect(() => {
        setDriverPicks(prevDriverPicks);
        setConstructorPicks(prevConstructorPicks);
    }, prevConstructorPicks, prevDriverPicks);

    return (
        <div>
            <h2 className="mt-2">Previous round picks:</h2>
            <div className="d-flex flex-row mt-2 ms-1">
            <div className="d-flex flex-column PrevPicksColumn">
                <h3 className="mb-1">Driver Picks</h3>
                {drivers.map((driver, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" checked={driverPicks.findIndex(id=>driver.id===id) >= 0} onChange={e=>driverCheckChange(driver.id, e.target.checked, driverPicks, constructorPicks, onChange)} id={`driver-${driver.id}`}/>
                    <label className="form-check-label" htmlFor={`driver-${driver.id}`}>{driver.name}</label>
                </div>
                ))}
            </div>
            <div className="d-flex flex-column PrevPicksColumn">
                <h3 className="mb-1">Constructor Picks</h3>
                {constructors.map((constructor, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" checked={constructorPicks.findIndex(id=>id===constructor.id) >= 0} onChange={e=>constructorCheckChange(constructor.id,e.target.checked, driverPicks, constructorPicks, onChange)} id={`constructor-${constructor.id}`}/>
                    <label className="form-check-label" htmlFor={`constructor-${constructor.id}`}>{constructor.name}</label>
                </div>
                ))}
            </div>
            </div>
        </div>
    );
}

function driverCheckChange(driverId, checked, driverPicks, constructorPicks, onChange) {
    const newDriverPicks = [...driverPicks];
    if (checked) {
        newDriverPicks.push(driverId);
    } else {
        newDriverPicks.splice(newDriverPicks.findIndex(driver => driver.id === driverId), 1);
    }
    onChange(newDriverPicks, constructorPicks);
}
function constructorCheckChange(constructorId, checked, driverPicks, constructorPicks, onChange) {
    const newConstructorPicks = [...constructorPicks];
    if (checked) {
        newConstructorPicks.push(constructorId);
    } else {
        newConstructorPicks.splice(newConstructorPicks.findIndex(constructor => constructor.id === constructorId), 1);
    }
    onChange(driverPicks, newConstructorPicks);
}