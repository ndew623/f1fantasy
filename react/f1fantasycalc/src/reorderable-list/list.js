import React from 'react';
import {Reorder} from 'framer-motion';
import { useState } from "react";

function TestList() {
    const [items, setItems] = useState(["asdf", "qwerty", "wasd"]);
    return (
        <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map((item) => (
                <Reorder.Item key={item} value={item}>{item}</Reorder.Item>
            ))}
        </Reorder.Group>
    )
}

export default TestList;