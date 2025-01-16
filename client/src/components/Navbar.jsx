import { Settings, User, LogOut, Home } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    }
  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Home className="w-6 h-6" />
          <span>MyApp</span>
        </Link>
      </div>

      {/* Menu Kanan */}
      <div className="flex-none">
        <div className="flex items-center gap-4">
          {/* Settings */}
          <button className="btn btn-ghost btn-circle" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>

          {/* Jika sudah login, tampilkan Profile dan Logout */}
          {isAuthenticated && user && (
            <>
              <button
                className="btn btn-ghost btn-circle"
                aria-label="Profile"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5" />
              </button>
              <button
                className="btn btn-ghost btn-circle"
                aria-label="Logout"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
