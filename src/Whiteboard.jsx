import "./Whiteboard.css"
import WhiteboardCanvas from "./WhiteboardCanvas"
import { useEffect, useState, useRef } from "react"



export default function Whiteboard() {
    const [isDragging, setDragging] = useState(false);
    const [initialX, setInitialX] = useState(0);
    const [initialY, setInitialY] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [currentScale, setCurrentScale] = useState(0.5);
    const [whiteboards, setWhiteboards] = useState([<WhiteboardCanvas key={0} handleDelete={() => handleDeleteBoard(0)}/>]);
    const boardsRef = useRef();

    const MIN_ZOOM = 0.25;
    const MAX_ZOOM = 2.0;
    const BUTTON_ZOOM_FACTOR = 0.33;
    const MAX_WHITEBOARD_COUNT = 3;

    useEffect(() => {
        const boards = document.getElementById("board-wrapper");
        const actualStyle = window.getComputedStyle(boards);

        setCurrentScale(actualStyle.scale);
    }, [])

    function handleMouseDown(e) {
        if(e.button !== 2) return;

        setDragging(true);

        document.body.style.cursor = "grab";

        setInitialX(e.clientX);
        setInitialY(e.clientY);

        const rect = boardsRef.current.getBoundingClientRect();

        setCurrentX((rect.left + (rect.width / 2)) - window.innerWidth / 2);
        setCurrentY((rect.top + (rect.height / 2)) - window.innerHeight / 2);


        e.preventDefault();

    }

    function handleMouseDrag(e) {
        if(!isDragging) return;

        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        boardsRef.current.style.translate = `${currentX + deltaX}px ${currentY + deltaY}px`
    }

    function handleMouseUp(e) {

        document.body.style.cursor = "default";

        setDragging(false);

        setInitialX(e.clientX);
        setInitialY(e.clientY);
    }


    function handleZoom(e) {
        e.preventDefault();

        const zoomSpeed = 0.05;
        const zoomFactor = 1 + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed);
        
        let newScale = currentScale * zoomFactor;

        if(newScale <= 0.25) {
            newScale = 0.25;
        }

        if(newScale >= 2.0) {
            newScale = 2.0;
        }

        setCurrentScale(newScale);
        boardsRef.current.style.scale = newScale;

    }
    
    function handleZoomOut() {
        const newScale = currentScale * (1 - BUTTON_ZOOM_FACTOR) > MIN_ZOOM ? currentScale * (1 - BUTTON_ZOOM_FACTOR) : MIN_ZOOM;

        let anim = boardsRef.current.animate([{scale: boardsRef.current.style.translate}, {scale: newScale}], {duration: 100, easing: "ease-out"})

        anim.onfinish = () => {
            setCurrentScale(newScale);
            boardsRef.current.style.scale = newScale;
        }
    }

    function handleZoomIn() {
        const newScale = currentScale * (1 + BUTTON_ZOOM_FACTOR) < MAX_ZOOM ? currentScale * (1 + BUTTON_ZOOM_FACTOR) : MAX_ZOOM;

        let anim = boardsRef.current.animate([{scale: boardsRef.current.style.translate}, {scale: newScale}], {duration: 100, easing: "ease-out"})

        anim.onfinish = () => {
            setCurrentScale(newScale);
            boardsRef.current.style.scale = newScale;
        }
    }

    function handleRecenter() {
        let anim = boardsRef.current.animate([{translate: boardsRef.current.style.translate, style: boardsRef.current.style.scale}, {translate: "0 0", scale: 0.5}], {duration: 333, easing: "ease-out"});

        // Update the stuff after the fancy animation finishes
        anim.onfinish = () => {
            boardsRef.current.style.translate = "0 0";
            boardsRef.current.style.scale = "0.5";

            setCurrentScale(0.5);
        }
    }

    function handleAddBoard() {
        if(whiteboards.length >= MAX_WHITEBOARD_COUNT) return;
        
        setWhiteboards([...whiteboards, <WhiteboardCanvas key={whiteboards.length} handleDelete={() => {handleDeleteBoard(whiteboards.length)}}/>])
    }

    function handleDeleteBoard(index) {
        const updatedBoards = whiteboards.filter((_, i) => i !== index);
        setWhiteboards(updatedBoards);
    }

    function renderWhiteboards() {
        return whiteboards.map((_, index) => <WhiteboardCanvas key={index} handleDelete={() => handleDeleteBoard(index)}/>)
    }

    return (
        <main onWheel={handleZoom} onContextMenu={(e) => {e.preventDefault()}} onMouseDown={handleMouseDown} onMouseMove={handleMouseDrag} onMouseUp={handleMouseUp}>
            
            <div id="controls">
                <i className="fas fa-palette"></i>
                <i className="fas fa-pencil"></i>
                <i className="fas fa-eraser"></i>
                <i className="fas fa-font"></i>

                <div className="controls-bar"></div>

                <i onClick={handleRecenter} className="fas fa-arrows-to-circle"></i>
                <i onClick={handleZoomIn} className="fas fa-magnifying-glass-plus"></i>
                <i onClick={handleZoomOut} className="fas fa-magnifying-glass-minus"></i>


            </div>

            <div id="board-wrapper" ref={boardsRef}>
                {renderWhiteboards()}
                {whiteboards.length < MAX_WHITEBOARD_COUNT ? <button onClick={handleAddBoard} id="add-board" className="add-board"><i className="fas fa-plus"></i></button> : ""}
            </div>
        </main>

    )
}