import colorIcon from '../assets/colorIcon.svg';
import eraserIcon from '../assets/eraserIcon.svg';
import penImg from '../assets/pen.svg';
import adjustmentIcon from '../assets/size-adjustment.svg';
import panImg from '../assets/panIcon.svg';
import selectImg from '../assets/selectIcon.svg';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { HexColorPicker } from "react-colorful";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { TOOLS } from '../constants/tools';
import {toolStore} from '../store/toolStore';
import {eraser} from '../toolHandlers/eraser';
import {pen} from '../toolHandlers/pen';
import { pan } from '../toolHandlers/pan';
import { selection } from '../toolHandlers/selection';
import { useEffect } from 'react';


const StyledDiv = styled.div`
    position: fixed;
    left: 50%;
    top: 90%;
    transform: translate(-50%, 0%);
`
const Img = styled.img`
  width : 15px;
  height : 15px;
`
const StyledSlider = styled(Slider)`
    width: 150px;
    height: 20px;
    background-color: black;
`

function ToolBar() {

    // console.log("ToolBar Component");
    
    const  toolColor = toolStore(state => state.toolColor);
    const  toolSize = toolStore(state => state.toolSize);

    const setToolSize = toolStore.getState().setToolSize; 
    const setToolColor = toolStore.getState().setToolColor; 
    const setTool = toolStore.getState().setTool; 
    const setToolHandler = toolStore.getState().setToolHandlers;

    useEffect(() => {
        setTool(TOOLS.PEN);
        setToolHandler(pen);
    }, []);
    
    return (
        <div >
            <StyledDiv className="soft-corner-container">
                <button onClick={()=>{setTool(TOOLS.SELECT);setToolHandler(selection)}}>
                    <Img src={selectImg} alt="Select" />
                </button>
                <button onClick={()=>{setTool(TOOLS.PAN);setToolHandler(pan)}}>
                    <Img src={panImg} alt="Pan" />
                </button>
                <button onClick={()=>{setTool(TOOLS.PEN);setToolHandler(pen)}}>
                    <Img src={penImg} alt="pen to draw" />
                </button>
                <button onClick={()=>{setTool(TOOLS.ERASER);setToolHandler(eraser)}}>
                    <Img src={eraserIcon} alt="Eraser" />
                </button>
                
                <Popup 
                trigger={
                    <button >
                        <Img src={adjustmentIcon} alt="adjustment" />
                    </button>
                } 
                position="top center"
                >
                    <StyledSlider
                        min={1}
                        max={100}
                        defaultValue={toolSize}
                        onChange={setToolSize}
                        draggableTrack={true}
                    ></StyledSlider>
                </Popup>

                <Popup
                    trigger={
                        <button >
                            <Img src={colorIcon} alt="Colour" />
                        </button>
                    }
                    position="top center">
                    <HexColorPicker color={toolColor} onChange={setToolColor} />
                </Popup>
            </StyledDiv>
        </div>
    );
};

export default ToolBar;