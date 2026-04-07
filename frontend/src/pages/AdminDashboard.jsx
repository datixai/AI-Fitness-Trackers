// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Menu, X, Users, TrendingUp, DollarSign, Zap, Plus, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { get } = useApi();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activePlans: 0,
    totalRevenue: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const result = await get('/admin/dashboard');
    if (result.success) {
      setStats(result.data.dashboard);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminActions = [
    {
      icon: Users,
      label: 'Manage Clients',
      description: 'View and manage all clients',
      href: '/admin/clients'
    },
    {
      icon: Zap,
      label: 'Create Plans',
      description: 'Assign workout and meal plans',
      href: '/admin/plans'
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      description: 'View client progress analytics',
      href: '/admin/analytics'
    },
    {
      icon: FileText,
      label: 'Blog Manager',
      description: 'Write and publish articles',
      href: '/admin/blogs'
    },
    {
      icon: Video,
      label: 'Posture Videos',
      description: 'Manage exercise videos',
      href: '/admin/posture-videos'
    },
    {
      icon: DollarSign,
      label: 'Payments',
      description: 'Track client payments',
      href: '/admin/payments'
    }
  ];

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-white border-opacity-20">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Activity className="text-primary" size={20} />
              </div>
              <span className="font-bold">AM ADMIN</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white hover:bg-opacity-10 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <AdminSidebarLink icon={TrendingUp} label="Dashboard" href="/admin/dashboard" open={sidebarOpen} />
          <AdminSidebarLink icon={Users} label="Clients" href="/admin/clients" open={sidebarOpen} />
          <AdminSidebarLink icon={Zap} label="Plans" href="/admin/plans" open={sidebarOpen} />
          <AdminSidebarLink icon={DollarSign} label="Payments" href="/admin/payments" open={sidebarOpen} />
          <AdminSidebarLink icon={FileText} label="Blogs" href="/admin/blogs" open={sidebarOpen} />
          <AdminSidebarLink icon={Video} label="Videos" href="/admin/posture-videos" open={sidebarOpen} />
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white border-opacity-20">
          {sidebarOpen && (
            <div className="mb-4 pb-4 border-b border-white border-opacity-20">
              <p className="text-xs text-white text-opacity-70">Admin Account</p>
              <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-white text-opacity-70">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-white hover:bg-white hover:bg-opacity-10 p-2 rounded"
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
            <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, coach {user?.first_name}!</p>
          </div>
          <Link
            to="/admin/clients"
            className="flex items-center gap-2 btn btn-primary"
          >
            <Plus size={20} />
            Add Client
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Users} label="Total Clients" value={stats.totalClients} color="primary" />
                <StatCard icon={Zap} label="Active Plans" value={stats.activePlans} color="success" />
                <StatCard icon={DollarSign} label="Total Revenue" value={`€${stats.totalRevenue.toFixed(2)}`} color="warning" />
                <StatCard icon={TrendingUp} label="Avg. Retention" value="85%" color="info" />
              </div>

              {/* Actions Grid */}
              <h2 className="text-2xl font-bold text-dark mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {adminActions.map((action, idx) => {
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
              <h2 className="text-2xl font-bold text-dark mb-6">Recent Client Activity</h2>
              <div className="card">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="divide-y">
                    {stats.recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between py-4 px-6 hover:bg-gray-50">
                        <div>
                          <p className="font-semibold text-dark">{activity.first_name} {activity.last_name}</p>
                          <p className="text-sm text-gray-600">Last activity: {activity.last_activity || 'No activity yet'}</p>
                        </div>
                        <Link
                          to={`/admin/clients/${activity.id}`}
                          className="text-primary hover:text-secondary flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No recent activity. Start by adding your first client!
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Admin Sidebar Link Component
function AdminSidebarLink({ icon: Icon, label, href, open }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
    >
      <Icon size={20} />
      {open && <span>{label}</span>}
    </Link>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const bgColor = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info'
  }[color];

  const textColor = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info'
  }[color];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 ${bgColor} bg-opacity-10 rounded-lg`}>
          <Icon className={textColor} size={24} />
        </div>
      </div>
    </div>
  );
}
