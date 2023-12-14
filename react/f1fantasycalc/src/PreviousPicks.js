import { useState, useEffect } from 'react';
export function PreviousPicks({drivers, constructors, onChange}) {
    const [driverPicks, setDriverPicks] = useState([]);
    const [constructorPicks, setConstructorPicks] = useState([]);
    useEffect(() => {
        setDriverPicks(drivers.map(driver => {return {id: driver.id, name: driver.name, picked: false}}));
        setConstructorPicks(constructors.map(constructor => {return {id: constructor.id, name: constructor.name, picked: false}}));
    }, [drivers, constructors]);

    useEffect(() => {
        //return only the id and name of the drivers and constructors that were picked
        onChange(
            driverPicks.filter(driver => driver.picked).map(driver => {return {id: driver.id, name: driver.name}}),
            constructorPicks.filter(constructor => constructor.picked).map(constructor => {return {id: constructor.id, name: constructor.name}})
        );
    }, [driverPicks, constructorPicks]);
    return (
        <div>
            <h2 className="mt-2">Previous round picks:</h2>
            <div className="d-flex flex-row mt-2 ms-1">
            <div className="d-flex flex-column PrevPicksColumn">
                <h3 className="mb-1">Driver Picks</h3>
                {driverPicks.map((driver, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" checked={driverPicks[index].picked} onChange={e=>driverCheckChange(index, e.target.checked, setDriverPicks)} id={`driver-${driver.id}`}/>
                    <label className="form-check-label" htmlFor={`driver-${index}`}>{driver.name}</label>
                </div>
                ))}
            </div>
            <div className="d-flex flex-column PrevPicksColumn">
                <h3 className="mb-1">Constructor Picks</h3>
                {constructorPicks.map((constructor, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" checked={constructorPicks[index].picked} onChange={e=>constructorCheckChange(index,e.target.checked,setConstructorPicks)} id={`constructor-${constructor.id}`}/>
                    <label className="form-check-label" htmlFor={`constructor-${index}`}>{constructor.name}</label>
                </div>
                ))}
            </div>
            </div>
        </div>
    );
}

function driverCheckChange(index, checked, setDriverPicks) {
    setDriverPicks(prev => {
        const newDriverPicks = [...prev];
        newDriverPicks[index].picked = checked;
        return newDriverPicks;
    });
}
function constructorCheckChange(index, checked, setConstructorPicks) {
    setConstructorPicks(prev => {
        const newConstructorPicks = [...prev];
        newConstructorPicks[index].picked = checked;
        return newConstructorPicks;
    });
}