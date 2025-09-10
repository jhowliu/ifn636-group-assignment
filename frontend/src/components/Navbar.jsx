import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Auction House</Link>
      <div>
        {user ? (
          <>
            <Link to="/" className="mr-4 hover:text-blue-200">Auctions</Link>
            <Link to="/my-auctions" className="mr-4 hover:text-blue-200">My Auctions</Link>
            <Link to="/profile" className="mr-4 hover:text-blue-200">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="mr-4 hover:text-blue-200">Auctions</Link>
            <Link to="/login" className="mr-4 hover:text-blue-200">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
