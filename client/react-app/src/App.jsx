import './App.css'
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './pages/navigation/Header.jsx';
import Home from './pages/Home.jsx';
import About from './pages/AboutUs.jsx';
import Tickets from './pages/Buy-tickets.jsx';
import Services from './pages/Services.jsx';
import Cart from './pages/Cart.jsx';
import Shop from './pages/Shops.jsx';
import Parkshops from './pages/shops/Parkshops.jsx';
import Merchandise from './pages/shops/Merchandise.jsx';
import Register from './pages/registration/Register.jsx';
import Login from './pages/registration/Login.jsx';
import Dashboard from './pages/registration/Dashboard.jsx';
import Footer from './pages/navigation/Footer.jsx';

function App() {
    return(
        <>
            <div id='root'>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/about-us' element={<About />} />
                    <Route path='/tickets' element={<Tickets />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/shop' element={<Shop />} />
                    <Route path='/registration' element={<Register />} />
                    <Route path='/parkshops' element={<Parkshops />} />
                    <Route path='/merch' element={<Merchandise />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
                <Footer/>
            </div>
        </>
    );
}

export default App;