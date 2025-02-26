// import React from 'react';
import colorIcon from '../assets/colorIcon.svg';
import eraserIcon from '../assets/eraserIcon.svg';
import penImg from '../assets/pen.svg';
import adjustmentIcon from '../assets/size-adjustment.svg';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { HexColorPicker } from "react-colorful";
import Slider from 'rc-slider';

// import 'rc-slider/assets/index.css';
const StyledDiv = styled.div`
    & button.active{ 
        border : 1px solid red;
    }

    position: fixed;
    z-index: 10;
    align-items: center;
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

function ToolBar({
    handleEraser,
    handlePen,
    setColor,
    color,
    handleSlideBarChange,
}) {
    return (
        <div >
            <StyledDiv>
                <button className="active" onClick={handlePen}>
                    <Img src={penImg} alt="pen to draw" />
                </button>
                <button onClick={handleEraser}>
                    <Img src={eraserIcon} alt="Eraser" />
                </button>
                
                <Popup trigger={
                    <button >
                        <Img src={adjustmentIcon} alt="adjustment" />
                    </button>
                } position="top center">
                    <StyledSlider
                        min={1}
                        max={100}
                        onChange={handleSlideBarChange}
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
                    <HexColorPicker color={color} onChange={setColor} />
                </Popup>
            </StyledDiv>
        </div>
    );
};

export default ToolBar;