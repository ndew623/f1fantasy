import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useState, useEffect } from "react";
import { ReorderIcon } from './Icon.js';
import './OrderableList.scss';
import { posToPoints } from '../util/points.js';
import { getNameFromId } from '../util/idnames.js';

function OrderableList({drivers, order, onChange}) {
    const [driverIds, setDriverIds] = useState([]);
    const dragControls = useDragControls();

    useEffect(() => {
        if (order === undefined || order.length === 0) {
            let driverIds = drivers.map((driver) => driver.id);
            setDriverIds(driverIds);
            onChange(driverIds);
        }
    }, [drivers]);

    useEffect( ()=>{
            if (order !== undefined && order.length > 0) {
                setDriverIds(order);
            }
        },[order])

    return (
        <Reorder.Group axis="y" values={driverIds} onReorder={driverIds => onReorder(driverIds, setDriverIds, onChange)}>
            {driverIds.map((driverId, index) => (
                <Reorder.Item key={driverId} value={driverId} dragListener="false">
                    <div className="d-flex flex-row align-items-center">
                        <ReorderIcon dragControls={dragControls} />
                        <div className="ms-2 d-flex flex-row" style={{width: "18rem"}}>
                            <div style={{ width: "2.5rem" }}>{getPos(index + 1)}</div>
                            <div style={{width: "9rem"}}>{getNameFromId(driverId, drivers)}</div>
                            <div style={{width: "5rem"}}>{`(${posToPoints(index+1)} points)`}</div>
                        </div>
                    </div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    )
}

function onReorder(ids, setDriverIds, onChange) {
    setDriverIds(ids);
    onChange(ids);
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

export default OrderableList;