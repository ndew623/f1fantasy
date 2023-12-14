import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useState, useEffect } from "react";
import { ReorderIcon } from './Icon.js';
import './OrderableList.scss';

function OrderableList({drivers, onChange}) {
    const [driverIds, setDriverIds] = useState([]);
    const [driversState, setDriversState] = useState([]);
    const dragControls = useDragControls();

    useEffect(() => {
        let driverIds = drivers.map((driver) => driver.id);
        setDriverIds(driverIds);
        setDriversState(drivers);
    }, [drivers]);

    return (
        <Reorder.Group axis="y" values={driverIds} onReorder={driverIds => onReorder(driverIds, setDriverIds, onChange, drivers)}>
            {driverIds.map((driverId, index) => (
                <Reorder.Item key={driverId} value={driverId} dragListener="false">
                    <div className="d-flex flex-row align-items-center">
                        <ReorderIcon dragControls={dragControls} />
                        <div className="ms-2 d-flex flex-row" style={{width: "18rem"}}>
                            <div style={{ width: "2.5rem" }}>{getPos(index + 1)}</div>
                            <div style={{width: "9rem"}}>{getDriverNameFromId(driverId, drivers)}</div>
                            <div style={{width: "5rem"}}>{`(${posToPoints(index+1)} points)`}</div>
                        </div>
                    </div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    )
}

function getDriverNameFromId(id, drivers) {
    let result = drivers.find(driver => driver.id === id);
    if (result === undefined) {
        return "";
    }
    return result.name;
}

function onReorder(ids, setDriverIds, onChange, drivers) {
    setDriverIds(ids);
    onChange(ids.map((id, index) => ({id: id, pos: index+1, name: getDriverNameFromId(id, drivers)})));
}

function getPos(x) {
    let s = x.toString();
    let result = "";
    if (s.slice(-1) === "1" && s.slice(-2) !== "11") {
        result = `${x}st`;
    } else if (s.slice(-1) === "2" && s.slice(-2) !== "12") {
        result = `${x}nd`;
    } else if (s.slice(-1) === "3" && s.slice(-2) !== "13") {
        result = `${x}rd`;
    } else {
        result = `${x}th`;
    }
    return result;
}

function posToPoints(x) {
    let result = 0;
    switch (x) {
        case 1:
            result = 25;
            break;
        case 2:
            result = 18;
            break;
        case 3:
            result = 15;
            break;
        case 4:
            result = 12;
            break;
        case 5:
            result = 10;
            break;
        case 6:
            result = 8;
            break;
        case 7:
            result = 6;
            break;
        case 8:
            result = 4;
            break;
        case 9:
            result = 2;
            break;
        case 10:
            result = 1;
            break;
        default:
            result = 0;
            break;
    }
    return result;
}

export default OrderableList;