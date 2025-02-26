import Undo from '../assets/undo.svg';
import Redo from '../assets/redo.svg';
import styled from "styled-components";

const StyledDiv = styled.div`
    & button.active{ 
        border : 1px solid red;
    }

    position: fixed;
    z-index: 10;
    align-items: center;
    right: 1%;
    bottom: 90%;
    transform: translate(-50%, 0%);
`
const Img = styled.img`
  width : 15px;
  height : 15px;
`


function ActionBar({
    undo,
    redo,
    saveCanvas
}) {
    return (
        <div>
            <StyledDiv>
                <button onClick={undo}>
                    <Img src={Undo} alt="Undo" />
                </button>
                <button onClick={redo}>
                    <Img src={Redo} alt="Redo" />
                </button>
                <button onClick={saveCanvas}>
                    Save
                </button>
            </StyledDiv>
        </div>
    )
}
export default ActionBar;