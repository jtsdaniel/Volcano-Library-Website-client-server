import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VolcanoList from "./pages/VolcanoList";
import Volcano from './pages/Volcano';

import Header from "./components/Header";
import Footer from './components/Footer';
//Routing system of web app
export default function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Header />
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/volcanolist" element={<VolcanoList />} />
            <Route path="/volcano" element={<Volcano />}/>
    </Routes>
    <Footer />
    </div>
    </BrowserRouter>
  );
}


