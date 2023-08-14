import { useState } from 'react'
import './WhiteboardCanvas.css'

export default function WhiteboardCanvas( {handleDelete} ) {
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
        <div className="canvas-wrapper">
            <canvas className="canvas" id="canvas"></canvas>
            <button onClick={handleDelete} id="delete-button" className="delete-button"><i className="fas fa-trash-can"></i></button>
        </div>
    )
}
