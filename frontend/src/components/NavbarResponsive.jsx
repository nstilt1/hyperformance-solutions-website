"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Navbar = ({signOut}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  
  // Define your routes with sub-routes if applicable
  const routes = [
    { name: 'Home', href: '/' },
    { 
      name: 'Portfolio', 
      href: '/portfolio',
      subRoutes: [
        { name: 'Products', href: '/portfolio/products' },
        { name: 'Projects', href: '/portfolio/projects' },
        { name: 'Services', href: '/portfolio/services' },
      ]
    },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRouteClick = (routeName) => {
    setActiveRoute(routeName === activeRoute ? null : routeName);
    // On mobile, closing the menu after selection
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-purple-600 text-xl font-bold">
              Tiger Wellness Hub
            </Link>
          </div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
                {routes.map((route) => (
                <div key={route.href} className="group relative pb-2"> {/* <- padding on parent */}
                    <Link
                    href={route.href}
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md inline-flex"
                    >
                    {route.name}
                    </Link>

                    {route.subRoutes?.length > 0 && (
                    <div
                        className="
                        absolute left-0 top-full
                        hidden group-hover:flex group-focus-within:flex
                        flex-col bg-white shadow-lg rounded-md z-50"
                    >
                        {route.subRoutes.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 whitespace-nowrap"
                        >
                            {item.name}
                        </Link>
                        ))}
                    </div>
                    )}
                </div>
                ))}
                
                <a onClick={signOut} className="hover:underline">
                  Sign Out
                </a>
            </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-purple-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 right-0 w-full bg-white shadow-lg rounded-md z-50">
              {routes.map((route) => (
                <div key={route.href} className={`group ${activeRoute === route.name ? 'active' : ''}`}>
                  <Link href={route.href}><button
                    onClick={() => handleRouteClick(route.name)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-purple-50 ${
                      activeRoute === route.name ? 'text-purple-600 border-b-2 border-purple-600' : ''
                    }`}
                  >
                    <span>{route.name}</span>
                    {route.subRoutes && (
                      <svg className="w-4 h-4 text-gray-400 hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    )}
                  </button>
                  </Link>
                  {/* Mobile Submenu */}
                  {route.subRoutes && (
                    <div className="mt-1 space-y-1">
                    {route.subRoutes.map((subRoute) => (
                        <div key={subRoute.href} className="flex items-center pl-4">
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                        <Link
                            href={subRoute.href}
                            onClick={() => handleRouteClick(subRoute.name)}
                            className={`text-gray-700 hover:text-purple-600 hover:underline ${
                            activeRoute === subRoute.name ? 'text-purple-600 font-medium' : ''
                            }`}
                        >
                            {subRoute.name}
                        </Link>
                        </div>
                    ))}
                    </div>

                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;