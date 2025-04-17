import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import ToolBar from "../components/ToolBar";
import ActionBar from "../components/ActionBar";
import CanvasBoard from "../components/CanvasBoard";


const MainPanel = styled.div`
    display: flex;
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: auto;
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
