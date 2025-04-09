import { Routes, Route } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import './App.css'

function App() {
  // need to add a home page ,for temporarily i added canvas as stating point
  return (
    <Routes>
      <Route path="/" element={<CanvasPage/>} />  
    </Routes>
  )
}

export default App
