import React from 'react';
import { NavLink } from 'react-router-dom';


// Note: Kita akan import icons dari react-icons langsung
import { FiHome as HomeIcon, FiUsers as UsersIcon, FiActivity as ActivityIcon, FiAlertTriangle as AlertIcon } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Pengguna', path: '/users', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'Aktivitas', path: '/activities', icon: <ActivityIcon className="w-5 h-5" /> },
    { name: 'Laporan', path: '/reports', icon: <AlertIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          SkillSwap
        </h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-slate-300 hover:text-white cursor-pointer px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
            alt="Admin" 
            className="w-8 h-8 rounded-full bg-slate-800"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold">Super Admin</p>
            <p className="text-xs text-slate-400">admin@skillswap.id</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
