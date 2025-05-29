import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  BarChart4, 
  Home, 
  FileText, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { getUserInitials } from '../../utils/helpers';
import { dummyNotifications } from '../../data/dummyData';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Filter notifications for current user
  const userNotifications = dummyNotifications.filter(
    notification => notification.userId === user?.id
  ).slice(0, 5);

  const unreadCount = userNotifications.filter(notification => !notification.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-4 text-gray-500"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <BarChart4 className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-xl font-bold text-primary">InvoiceBox</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full relative"
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-error text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {userNotifications.length > 0 ? (
                    userNotifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "px-4 py-3 border-b border-gray-200 hover:bg-gray-50",
                          !notification.isRead && "bg-primary-50"
                        )}
                      >
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-primary text-sm font-medium w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative">
            <button 
              className="flex items-center hover:bg-gray-100 rounded-md p-1 pr-2 transition-colors"
              onClick={toggleProfile}
            >
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                {getUserInitials(user?.name || '')}
              </div>
              <span className="hidden md:inline text-sm font-medium mr-1">
                {user?.name}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200 text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
                <div>
                  <NavLink 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </div>
                  </NavLink>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <div
          className={cn(
            "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={closeSidebar}
        ></div>
        
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-white w-64 border-r border-gray-200 flex flex-col z-50 transition-transform",
            "fixed top-0 left-0 h-full md:static md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between md:hidden">
            <div className="flex items-center">
              <BarChart4 className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-lg font-bold text-primary">InvoiceBox</h1>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={closeSidebar}
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary-50 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
              onClick={closeSidebar}
            >
              <Home size={18} className="mr-3" />
              Dashboard
            </NavLink>
            
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary-50 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
              onClick={closeSidebar}
            >
              <FileText size={18} className="mr-3" />
              Invoices
            </NavLink>
            
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary-50 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
              onClick={closeSidebar}
            >
              <User size={18} className="mr-3" />
              Profile
            </NavLink>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3" />
              Sign out
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;