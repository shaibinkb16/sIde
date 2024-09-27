import React from 'react';
import Sidebar from './Sidebar'; // Adjust the import path if necessary

const Layout = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar className="w-1/6 bg-gray-800" />
    <main className="flex-grow">
      {children}
    </main>
  </div>
);

export default Layout;
