
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="h-6 w-6 bg-primary rounded-full"></div>
            <div className="h-6 w-6 bg-gray-800 rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">Blogosphere</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/my-blogs" className="text-gray-600 hover:text-gray-900">
            My Blogs
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/create" className="text-gray-600 hover:text-gray-900">
                Write
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Hi, {user?.name}
                </span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button>
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/my-blogs" 
              className="text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              My Blogs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/create" 
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Write
                </Link>
                <div className="flex flex-col space-y-4 pt-2 border-t">
                  <span className="text-gray-700">
                    Hi, {user?.name}
                  </span>
                  <Button variant="outline" onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-4 pt-2 border-t">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
