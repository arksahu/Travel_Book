import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  Bookmark,
  User,
  Settings,
  Sparkles,
  X,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Plan New Trip', path: '/plan', icon: PlusCircle, highlight: true },
    { name: 'Saved Trips', path: '/trips', icon: Bookmark },
    { name: 'Traveler Profile', path: '/profile', icon: User },
    { name: 'Settings & Status', path: '/settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200 w-64 p-4">
      {/* Mobile Header with Close button */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 md:hidden">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-slate-900">WanderWise</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation links */}
      <div className="space-y-1.5 flex-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-teal-50 text-teal-700 font-semibold'
                    : item.highlight
                    ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Inspiration Quick Prompt Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-100 text-xs">
        <div className="flex items-center gap-2 text-teal-800 font-semibold mb-1">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Curated AI Insight</span>
        </div>
        <p className="text-slate-600 leading-relaxed mb-3">
          Spring cherry blossoms in Kyoto are ideal for early November bookings.
        </p>
        <NavLink
          to="/plan"
          onClick={onCloseMobile}
          className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 hover:underline"
        >
          <MapPin className="w-3.5 h-3.5" /> Plan Kyoto Trip &rarr;
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-[calc(100vh-4rem)] sticky top-16 no-print flex-shrink-0">
        {content}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 h-full bg-white shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
