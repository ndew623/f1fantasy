import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useState } from "react";
import { ReorderIcon } from './Icon.js';
import './OrderableList.scss';

function OrderableList() {
    const [items, setItems] = useState(["Max Verstappen", "Sergio Perez", "Lewis Hamilton", "George Russell", "Charles Leclerc", "Carlos Sainz", "Pierre Gasly", "Esteban Ocon", "Daniel Ricciardo", "Yuki Tsunoda", "Lando Norris", "Oscar Piastri", "Alex Albon", "Logan Sergeant", "Kevin Magnussen", "Nico Hulkenberg", "Fernando Alonso", "Lance Stroll", "Valteri Bottas", "Zhou Guanyu"]);
    const dragControls = useDragControls();
    return (
        <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map((item, index) => (
                <Reorder.Item key={item} value={item} dragListener="false">
                    <div class="d-flex flex-row align-items-center">
                        <ReorderIcon dragControls={dragControls} />
                        <div className="ms-2 d-flex flex-row" style={{width: "18rem"}}>
                            <div style={{ width: "2.5rem" }}>{getPos(index + 1)}</div>
                            <div style={{width: "9rem"}}>{item}</div>
                            <div style={{width: "5rem"}}>{`(${posToPoints(index+1)} points)`}</div>
                        </div>
                    </div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    )
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