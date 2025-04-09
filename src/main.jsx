//the below code is to disable console.log in production mode
// if (process.env.NODE_ENV === "production") {
//   console.log = () => {};
//   console.warn = () => {};  // (Optional) Disable warnings too
//   console.error = () => {}; // (Optional) Disable errors too
// }


// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Use environment variable to decide base
// const baseName = import.meta.env.MODE === 'production' ? '/Board' : '/';
// console.log("Base name is: ", baseName);
console.log("Base url ", import.meta.env.BASE_URL);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App/>
    </BrowserRouter>
  // </StrictMode>,
)
