import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LogOut, FileText, User } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-primary">ORTAM</span>
                <span className="text-accent"> AI</span>
              </div>
              <FileText className="text-primary" size={24} />
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-textSecondary">
                <User size={18} />
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {user?.role === 'ADMIN' ? 'מנהל' : 'עורך'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-textSecondary hover:text-accent transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm">יציאה</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
