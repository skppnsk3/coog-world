import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/navigation/Header.jsx';
import Home from './pages/Home.jsx';
import Tickets from './pages/Buy-tickets.jsx';
import Services from './pages/Dashboard.jsx';
import Cart from './pages/Cart.jsx';
import Contact from './pages/Contact.jsx';
import Register from './pages/registration/Register.jsx';
import Footer from './pages/navigation/Footer.jsx';

function App() {
    return(
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/tickets' element={<Tickets />} />
                <Route path='/services' element={<Services />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/registration' element={<Register />} />
            </Routes>
            <Footer/>
        </>
    );
}

export default App;