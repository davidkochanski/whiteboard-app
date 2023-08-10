import "./Whiteboard.css"
import WhiteboardCanvas from "./WhiteboardCanvas"
import { useEffect, useState, useRef } from "react"



export default function Whiteboard() {
    const [isDragging, setDragging] = useState(false);
    const [initialX, setInitialX] = useState(0);
    const [initialY, setInitialY] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [currentScale, setCurrentScale] = useState(0);
    const boardsRef = useRef();

    const MIN_ZOOM = 0.25;
    const MAX_ZOOM = 2.0;
    const BUTTON_ZOOM_FACTOR = 0.33;

    useEffect(() => {
        const boards = document.getElementById("board-wrapper");

        const actualStyle = window.getComputedStyle(boards);

        setCurrentScale(actualStyle.scale);
    })

    function handleMouseDown(e) {
        if(e.button !== 2) return;

        setDragging(true);

        setInitialX(e.clientX);
        setInitialY(e.clientY);

        const boards = document.getElementById("board-wrapper");

        setCurrentX(boards.offsetLeft);
        setCurrentY(boards.offsetTop);

        e.preventDefault();

    }

    function handleMouseDrag(e) {
        if(!isDragging || e.button !== 2) return;

        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        console.log(deltaX, deltaY);

        const boards = document.getElementById("board-wrapper");

        boards.style.left = `${deltaX + currentX}px`
        boards.style.top = `${deltaY + currentY}px`

        
    }

    function handleMouseUp(e) {
        setDragging(false);

        setInitialX(e.clientX);
        setInitialY(e.clientY);
    }


    function handleZoom(e) {
        e.preventDefault();

        const boards = document.getElementById("board-wrapper");

        const zoomSpeed = 0.05;
        const zoomFactor = 1 + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed);
        
        const newScale = currentScale * zoomFactor;

        console.log(boards.style.scale);
        if(newScale > 0.25 && newScale < 2.0) {
            setCurrentScale(newScale);
            boards.style.scale = newScale;
        }

    }
    
    function handleZoomOut(e) {

        const newScale = currentScale * (1 - BUTTON_ZOOM_FACTOR) > MIN_ZOOM ? currentScale * (1 - BUTTON_ZOOM_FACTOR) : MIN_ZOOM;

        setCurrentScale(newScale);

        boardsRef.current.style.scale = newScale;
    }

    function handleZoomIn(e) {


        const newScale = currentScale * (1 + BUTTON_ZOOM_FACTOR) < MAX_ZOOM ? currentScale * (1 + BUTTON_ZOOM_FACTOR) : MAX_ZOOM;

        setCurrentScale(newScale);

        boardsRef.current.style.scale = newScale;

    }


    return (
        <main onWheel={handleZoom} onContextMenu={(e) => {e.preventDefault()}} onMouseDown={handleMouseDown} onMouseMove={handleMouseDrag} onMouseUp={handleMouseUp} onMouseOut={handleMouseUp}>
            
            <div id="controls">
                <i className="fas fa-pencil"></i>
                <i className="fas fa-palette"></i>
                <i className="fas fa-eraser"></i>
                <i className="fas fa-font"></i>

                <div className="controls-bar"></div>

                <i onClick={handleZoomIn} className="fas fa-magnifying-glass-plus"></i>
                <i onClick={handleZoomOut} className="fas fa-magnifying-glass-minus"></i>


            </div>

            <div id="board-wrapper" ref={boardsRef}>
                <WhiteboardCanvas/>
                <WhiteboardCanvas/>
                <WhiteboardCanvas/>
            </div>
        </main>

    )
}