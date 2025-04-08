import { Routes, Route } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import './App.css'

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<CanvasPage/>} />  //need to add a home page ,for temporarily i added canvas as stating point
    </Routes>
  )
}

export default App
