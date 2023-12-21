import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import './App.css'
import Login from './components/Login';
import Register from './components/Register';
import CreateNFT from './components/CreateNFT';
import BuyNFT from './components/BuyNFT';
import ListNFT from "./components/listNFT";
import MyProfile from "./components/myProfile";
import MyOffers from "./components/myOffers";
import ChangePassword from "./components/ChangePassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/listNFT" element={<ListNFT />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/myOffers" element={<MyOffers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-nft" element={<CreateNFT />} />
        <Route path="/buy-nft" element={<BuyNFT />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

