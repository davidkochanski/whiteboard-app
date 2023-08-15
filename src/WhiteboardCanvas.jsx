import React, { useState, useRef, useEffect } from 'react';
import './WhiteboardCanvas.css';

export default function WhiteboardCanvas({ handleDelete, idx }) {
    const [isDrawing, setDrawing] = useState(false);
    const canvasRef = useRef();
    const penRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const pen = canvas.getContext("2d");

        pen.scale(2,2);

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        pen.lineCap = "round";
        pen.strokeStyle = "black";
        pen.lineWidth = 2;

        penRef.current = pen;
    }, []);

    function handlePenDown(event) {
        if(event.button !== 0) return;

        setDrawing(true);
        const pen = penRef.current;
        const { offsetX, offsetY } = event.nativeEvent;
        pen.beginPath();
        pen.moveTo(offsetX, offsetY);
        pen.lineTo(offsetX, offsetY);
        pen.stroke();
        pen.closePath();
    }

    function handleDrawing(event) {
        if (!isDrawing) return;
        const pen = penRef.current;
        const { offsetX, offsetY } = event.nativeEvent;
        pen.lineTo(offsetX, offsetY);
        pen.stroke();
    }

    function handlePenUp() {
        setDrawing(false);
        const pen = penRef.current;
        pen.closePath();
    }

    function onDeleteClick() {
        handleDelete(idx);
    }

    return (
        <div className="canvas-wrapper">
            <canvas
                ref={canvasRef}
                className="canvas"
                id="canvas"
                onMouseDown={handlePenDown}
                onMouseMove={handleDrawing}
                onMouseUp={handlePenUp}
                onMouseLeave={handlePenUp}
            ></canvas>
            <button onClick={onDeleteClick} id="delete-button" className="delete-button">
                <i className="fas fa-trash-can"></i>
            </button>
        </div>
    );
}
