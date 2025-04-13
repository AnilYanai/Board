import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import ToolBar from "../components/ToolBar";
import ActionBar from "../components/ActionBar";
import CanvasBoard from "../components/CanvasBoard";


const MainPanel = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
`

function CanvasPage() {
    
    // console.log("CanvasPage");

    return (
        <div>
            <MainPanel>
                <CanvasBoard/>
                <ActionBar/>
                <ToolBar/>
            </MainPanel>
        </div>
    );
};

export default CanvasPage;
