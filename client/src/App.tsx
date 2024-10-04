import './index.css'
import './App.css'
import CustomersView from "./components/CustomersView.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminView from "./components/AdminView.tsx";
import Home from "./components/Home.tsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/customers" element={<CustomersView/>} />
                <Route path="/admin" element={<AdminView/>} />

            </Routes>
        </BrowserRouter>


    </>
  )
}

export default App
