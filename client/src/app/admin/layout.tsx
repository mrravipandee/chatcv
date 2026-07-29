'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  FileCode,
  ShieldCheck,
  ChevronDown,
  Terminal
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('ChatCV Production');
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Load and apply theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('admin-theme', newTheme ? 'dark' : 'light');
  };

  // Keyboard shortcut for Command+K search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems: SidebarItem[] = [
    {
      label: 'Overview Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="h-4.5 w-4.5" />
    },
    {
      label: 'Admin Settings',
      href: '#',
      icon: <Settings className="h-4.5 w-4.5" />
    }
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-zinc-50 border-r border-zinc-200 dark:bg-zinc-950 dark:border-zinc-900 transition-colors duration-200">
      {/* Platform Title & Workspace Switcher */}
      <div className="flex flex-col px-5 py-5 border-b border-zinc-250/20 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-[#00ff9c] font-black tracking-tighter dark:bg-white dark:text-black">
            C
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
              ChatCV Admin
            </span>
            <span className="ml-1 text-[9px] rounded-md bg-zinc-200 px-1 py-0.5 font-bold text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400">
              V1.4
            </span>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative mt-4">
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-3xs transition-all hover:bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              {activeWorkspace}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          </button>

          {showWorkspaceDropdown && (
            <div className="absolute left-0 right-0 z-55 mt-1.5 rounded-lg border border-zinc-200 bg-white p-1 shadow-md dark:border-zinc-900 dark:bg-zinc-900">
              {['ChatCV Production', 'ChatCV Staging'].map((workspace) => (
                <button
                  key={workspace}
                  onClick={() => {
                    setActiveWorkspace(workspace);
                    setShowWorkspaceDropdown(false);
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-xs font-medium text-zinc-750 hover:bg-zinc-100 dark:text-zinc-350 dark:hover:bg-zinc-800/60"
                >
                  {workspace}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Sidebar Items */}
      <nav className="flex-1 space-y-1.5 px-4 py-5">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                active
                  ? 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-black font-semibold'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation items */}
      <div className="space-y-1.5 border-t border-zinc-200 p-4 dark:border-zinc-900">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-zinc-400" />
          User Dashboard
        </Link>
        <div className="flex items-center justify-between rounded-lg bg-zinc-100 px-3.5 py-3.5 dark:bg-zinc-900/50 text-[10px] text-zinc-450 dark:text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Authorized Admin
          </span>
        </div>
      </div>
    </div>
  );

  return (
    // We toggle the 'dark' class on a root container which coordinates styling changes
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-50 transition-colors duration-200">
        
        {/* Desktop Sidebar Layout */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            {sidebarContent}
          </div>
        </aside>

        {/* Mobile Navigation Sidebar drawer overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-zinc-950/65 backdrop-blur-xs">
            <div className="relative w-64 animate-slide-right">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="h-full">{sidebarContent}</div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Core Layout Right-side container */}
        <div className="flex flex-1 flex-col min-w-0">
          
          {/* Header Navigation Section */}
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-900 dark:bg-black/80 transition-colors duration-200">
            <div className="flex items-center gap-4">
              {/* Menu Toggle button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 lg:hidden dark:border-zinc-900 text-zinc-550 dark:text-zinc-400"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>

              {/* Search shortcut button (Linear Style) */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3.5 py-1.5 text-xs text-zinc-400 shadow-3xs transition-colors hover:border-zinc-300 sm:flex dark:border-zinc-900 dark:bg-zinc-900/30 dark:hover:border-zinc-800"
              >
                <Search className="h-3.5 w-3.5 text-zinc-450" />
                <span>Search dashboard metrics...</span>
                <kbd className="ml-5 inline-flex items-center gap-0.5 rounded border border-zinc-250/20 bg-zinc-100 px-1.5 font-mono text-[9px] font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-4">
              {/* Dark/Light mode toggle switcher */}
              <button
                onClick={toggleTheme}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {/* Notification icon */}
              <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#00ff9c]" />
              </button>

              {/* Avatar indicator */}
              <div className="h-7 w-7 rounded-full border border-zinc-200 bg-black text-[10px] font-bold text-[#00ff9c] flex items-center justify-center dark:border-zinc-900 dark:bg-white dark:text-black">
                AD
              </div>
            </div>
          </header>

          {/* Main page content area */}
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Global Command modal overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-100 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-xs px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl animate-fade-in dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center border-b border-zinc-100 px-4 py-3 dark:border-zinc-900">
              <Search className="mr-3.5 h-4.5 w-4.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Type a command or metric name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-850 placeholder-zinc-400 outline-hidden dark:text-zinc-200"
                autoFocus
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="rounded border border-zinc-200 px-1.5 py-0.5 text-3xs font-semibold text-zinc-400 dark:border-zinc-900"
              >
                ESC
              </button>
            </div>
            
            {/* Command search listings */}
            <div className="p-2 max-h-64 overflow-y-auto">
              <p className="px-2.5 py-2 text-3xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
                Suggested Actions
              </p>
              
              <div className="space-y-0.5">
                {[
                  { label: 'View Visitors Report', icon: <LayoutDashboard className="h-4 w-4" /> },
                  { label: 'Review System Errors', icon: <Terminal className="h-4 w-4" /> },
                  { label: 'Go to Settings', icon: <Settings className="h-4 w-4" /> }
                ]
                  .filter((cmd) => cmd.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((cmd) => (
                    <button
                      key={cmd.label}
                      onClick={() => {
                        setShowSearchModal(false);
                        alert(`Redirecting to: ${cmd.label} (Mock Action)`);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-zinc-700 hover:bg-zinc-100 text-left dark:text-zinc-300 dark:hover:bg-zinc-900/60"
                    >
                      {cmd.icon}
                      {cmd.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
