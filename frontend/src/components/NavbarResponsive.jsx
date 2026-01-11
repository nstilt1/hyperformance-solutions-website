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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [name, setName] = useLocalStorage("nickname", null);
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const [tempName, setTempName] = useState(name ?? "");
  
  // Define your routes with sub-routes if applicable
  const routes = [
    { name: 'Home', href: '/' },
    { 
      name: 'Mindfulness & Medication', 
      href: '/mindfulness-medication',
      subRoutes: [
        { name: 'Breathing Guide', href: '/mindfulness-medication/breathing-guide' },
        { name: 'Medication Tracker', href: '/mindfulness-medication/medication-tracker' }
      ]
    },
    { name: 'Focus', href: '/focus' },
    { name: 'Mood', href: '/mood' },
    { name: 'Resources', href: '/resources' },
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
            </div>
        </div>

        {/* Profile Icon */}
        <div className="z-50">
          <button
            onClick={() => {
              setTempName(name ?? "");
              setNicknameOpen(true);
            }}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M5.121 17.804A9 9 0 1118.88 17.804M12 7a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
          </button>
        </div>
        <Dialog open={nicknameOpen} onOpenChange={setNicknameOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Your Nickname</DialogTitle>
              <DialogDescription>
                Enter a nickname you&apos;d like the app to use when addressing you.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-3">
              <div className="grid gap-1">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g., Boss, Chief..."
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                onClick={() => {
                  setName(tempName);
                  setNicknameOpen(false);
                }}
              >
                Save Nickname
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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