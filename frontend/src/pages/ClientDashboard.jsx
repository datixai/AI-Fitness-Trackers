// src/pages/ClientDashboard.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Menu, X, BarChart3, Apple, TrendingUp, Heart, FileText, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    {
      icon: Heart,
      label: 'Daily Log',
      description: 'Log weight, mood, energy',
      href: '/dashboard/daily-log'
    },
    {
      icon: Apple,
      label: 'Food Log',
      description: 'Track meals and nutrition',
      href: '/dashboard/food-log'
    },
    {
      icon: TrendingUp,
      label: 'Measurements',
      description: 'Record body measurements',
      href: '/dashboard/measurements'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      description: 'View your progress',
      href: '/dashboard/analytics'
    },
    {
      icon: FileText,
      label: 'Workouts',
      description: 'View your training plans',
      href: '/dashboard/workouts'
    },
    {
      icon: Video,
      label: 'Posture Videos',
      description: 'Learn proper form',
      href: '/dashboard/posture-videos'
    }
  ];

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <span className="font-bold text-primary">AM</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink icon={BarChart3} label="Dashboard" href="/dashboard" open={sidebarOpen} />
          <SidebarLink icon={Apple} label="Nutrition" href="/dashboard/food-log" open={sidebarOpen} />
          <SidebarLink icon={Activity} label="Workouts" href="/dashboard/workouts" open={sidebarOpen} />
          <SidebarLink icon={TrendingUp} label="Measurements" href="/dashboard/measurements" open={sidebarOpen} />
          <SidebarLink icon={Heart} label="Daily Log" href="/dashboard/daily-log" open={sidebarOpen} />
          <SidebarLink icon={BarChart3} label="Analytics" href="/dashboard/analytics" open={sidebarOpen} />
          <SidebarLink icon={FileText} label="Blogs" href="/blog" open={sidebarOpen} />
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t">
          {sidebarOpen && (
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-dark">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-danger hover:bg-red-50 p-2 rounded"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">Welcome, {user?.first_name}!</h1>
            <p className="text-gray-600">Here's your fitness overview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Today is {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Current Plan" value="Active" color="success" />
            <StatCard label="Daily Logs" value="12" color="info" />
            <StatCard label="Workouts Completed" value="8" color="primary" />
          </div>

          {/* Quick Actions */}
          <h2 className="text-2xl font-bold text-dark mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.href}
                  className="card hover:shadow-lg hover:scale-105 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">{action.label}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-dark mb-6">Recent Activity</h2>
            <div className="card">
              <p className="text-gray-600 text-center py-8">
                No recent activity yet. Start by logging your first entry!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ icon: Icon, label, href, open }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all"
    >
      <Icon size={20} />
      {open && <span>{label}</span>}
    </Link>
  );
}

// Stat Card Component
function StatCard({ label, value, color }) {
  const bgColor = {
    success: 'bg-success',
    info: 'bg-info',
    primary: 'bg-primary'
  }[color];

  return (
    <div className="card">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className={`text-3xl font-bold ${bgColor === 'bg-primary' ? 'text-primary' : bgColor === 'bg-success' ? 'text-success' : 'text-info'}`}>
        {value}
      </p>
    </div>
  );
}
