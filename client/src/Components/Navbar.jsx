import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (this is just an example, you should implement the actual logic)
    localStorage.removeItem("loggedIn"); // Example: Removing user data from localStorage

    // Redirect to login page after logout
    navigate("/login"); // Change '/login' to the appropriate route for your app
  };

  return (
    <nav className="bg-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Dashboard link with home icon */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-white hover:text-gray-300">
            <i className="bx bx-home-alt text-3xl"></i> {/* Box Icon for home */}
          </Link>
        </div>

        {/* Logout button with icon */}
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-700 flex items-center space-x-2"
          >
            <i className="bx bx-log-out text-3xl"></i> {/* Box Icon for logout */}
            <span className="hidden md:inline">Logout</span> {/* Text hidden on mobile */}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
