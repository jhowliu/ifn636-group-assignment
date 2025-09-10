import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Auctions from './pages/Auctions';
import AuctionDetail from './components/AuctionDetail';
import AuctionMgmt from './pages/AuctionMgmt';
import AuctionForm from './components/AuctionForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Auctions />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auctions/:id" element={<AuctionDetail />} />
          <Route path="/auctions/:id/edit" element={<AuctionForm isEdit={true} />} />
          <Route path="/auctions/create" element={<AuctionForm />} />
          <Route path="/my-auctions" element={<AuctionMgmt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
