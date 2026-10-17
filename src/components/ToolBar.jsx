'use client';

import colorIcon from "../assets/colorIcon.svg";
import eraserIcon from "../assets/eraserIcon.svg";
import penImg from "../assets/pen.svg";
import adjustmentIcon from "../assets/size-adjustment.svg";
import panImg from "../assets/panIcon.svg";
import selectImg from "../assets/selectIcon.svg";
import styled from "styled-components";
import Popup from "reactjs-popup";
import { HexColorPicker } from "react-colorful";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { TOOLS } from "../constants/tools";
import { toolStore } from "../store/toolStore";
import { eraser } from "../toolHandlers/eraser";
import { pen } from "../toolHandlers/pen";
import { pan } from "../toolHandlers/pan";
import { selection } from "../toolHandlers/selection";
import { useEffect } from "react";

const StyledDiv = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

const ToolButton = styled.button`
  background: ${(props) => (props.$active ? "#e2e8f0" : "transparent")};
  border: ${(props) => (props.$active ? "1px solid #94a3b8" : "1px solid transparent")};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: #f1f5f9;
  }
`;

const Img = styled.img`
  width: 18px;
  height: 18px;
`;

const StyledSlider = styled(Slider)`
  width: 150px;
  height: 20px;
`;

function ToolBar() {
  const selectedTool = toolStore((state) => state.selectedTool);
  const toolColor = toolStore((state) => state.toolColor);
  const toolSize = toolStore((state) => state.toolSize);

  const setToolSize = toolStore((state) => state.setToolSize);
  const setToolColor = toolStore((state) => state.setToolColor);
  const setTool = toolStore((state) => state.setTool);
  const setToolHandler = toolStore((state) => state.setToolHandlers);

  useEffect(() => {
    setTool(TOOLS.PEN);
    setToolHandler(pen);
  }, [setTool, setToolHandler]);

  return (
    <div>
      <StyledDiv>
        <ToolButton
          $active={selectedTool === TOOLS.SELECT}
          onClick={() => {
            setTool(TOOLS.SELECT);
            setToolHandler(selection);
          }}
          title="Select tool"
        >
          <Img src={selectImg.src || selectImg} alt="Select" />
        </ToolButton>

        <ToolButton
          $active={selectedTool === TOOLS.PAN}
          onClick={() => {
            setTool(TOOLS.PAN);
            setToolHandler(pan);
          }}
          title="Pan / Hand tool"
        >
          <Img src={panImg.src || panImg} alt="Pan" />
        </ToolButton>

        <ToolButton
          $active={selectedTool === TOOLS.PEN}
          onClick={() => {
            setTool(TOOLS.PEN);
            setToolHandler(pen);
          }}
          title="Pen tool"
        >
          <Img src={penImg.src || penImg} alt="Pen" />
        </ToolButton>

        <ToolButton
          $active={selectedTool === TOOLS.ERASER}
          onClick={() => {
            setTool(TOOLS.ERASER);
            setToolHandler(eraser);
          }}
          title="Eraser tool"
        >
          <Img src={eraserIcon.src || eraserIcon} alt="Eraser" />
        </ToolButton>

        <Popup
          trigger={
            <ToolButton title="Adjust brush size">
              <Img src={adjustmentIcon.src || adjustmentIcon} alt="Size Adjustment" />
            </ToolButton>
          }
          position="top center"
        >
          <div style={{ background: "white", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <div style={{ marginBottom: 6, fontSize: 12, fontWeight: "bold" }}>Size: {toolSize}px</div>
            <StyledSlider
              min={1}
              max={100}
              value={toolSize}
              onChange={setToolSize}
              draggableTrack={true}
            />
          </div>
        </Popup>

        <Popup
          trigger={
            <ToolButton title="Pick color">
              <Img src={colorIcon.src || colorIcon} alt="Color Picker" />
            </ToolButton>
          }
          position="top center"
        >
          <HexColorPicker color={toolColor} onChange={setToolColor} />
        </Popup>
      </StyledDiv>
    </div>
  );
}

export default ToolBar;