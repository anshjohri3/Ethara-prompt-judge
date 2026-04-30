import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ListTodo, PlusCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Ethara.AI Logo" className="h-8 text-blue-600" />
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              >
                <ListTodo size={18} />
                Tasks
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/create"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  <PlusCircle size={18} />
                  Create Task
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({user?.role === 'member' ? 'Tasker' : 'Admin'})
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;