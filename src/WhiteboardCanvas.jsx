import { useState } from 'react'
import './WhiteboardCanvas.css'

export default function WhiteboardCanvas() {
    const [isDrawing, setDrawing] = useState(false);

    function handlePenDown() {
        setDrawing(true);
    }

    function handleDrawing() {
        if(!isDrawing) return;
    }

    function handlePenUp() {
        setDrawing(false);
    }


    return (
        <>
            <canvas id="canvas"></canvas>
        </>
    )
}
