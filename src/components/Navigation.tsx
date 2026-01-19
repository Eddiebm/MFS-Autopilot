import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Megaphone, Users, Settings, LogOut } from 'lucide-react';

export function Navigation() {
  const { signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { to: '/leads', label: 'Leads', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-white">
          MFS Autopilot
        </Link>
        <div className="flex items-center gap-2">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white text-black font-medium'
                    : 'text-[#e0e0e0] hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-[#e0e0e0] hover:bg-white/10 hover:text-white rounded-lg transition-colors ml-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
