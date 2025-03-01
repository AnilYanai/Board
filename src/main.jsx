//the below code is to disable console.log in production mode
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};  // (Optional) Disable warnings too
  console.error = () => {}; // (Optional) Disable errors too
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
