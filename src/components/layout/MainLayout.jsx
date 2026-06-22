import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Gedankenstrom from '../Gedankenstrom';

export default function MainLayout() {
  return (
    <div className="min-h-screen relative">
      <Gedankenstrom />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}