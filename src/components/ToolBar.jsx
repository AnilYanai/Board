import React from 'react';
import colorIcon from '/assets/colorIcon.svg';
import eraserIcon from '/assets/eraserIcon.svg';
import penImg from '/assets/pen.svg';
import styled from 'styled-components';

const StyledDiv = styled.div`
    border : 1px solid blue;

    & button.active{ 
        border : 1px solid red;
    }
    `
const Img = styled.img`
  width : 15px;
  height : 15px;
`

function ToolBar({
    handleEraser,
    handlePen,
}) {
    return (
        <div>
            <StyledDiv>
                <button className="active" onClick={handlePen}>
                    <Img src={penImg} alt="pen to draw" />
                </button>
                <button onClick={handleEraser}>
                    <Img src={eraserIcon} alt="Eraser" />
                </button>
                <button >
                    <Img src={colorIcon} alt="Colour" />
                </button>
            </StyledDiv>
        </div>
    );
};

export default ToolBar;