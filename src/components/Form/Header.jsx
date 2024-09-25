import React from 'react';
import { Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center">
        <img src="" alt="" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-semibold">Branak</h1>
      </div>
      <div className="flex items-center">
        <Bell className="h-6 w-6 text-gray-600 mr-4" />
        <img src="" alt="" className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
};

export default Header;