import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { FileText } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'שגיאה בהתחברות');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-primary" size={40} />
              <div className="text-3xl font-bold">
                <span className="text-primary">ORTAM</span>
                <span className="text-accent"> AI</span>
              </div>
            </div>
            <h2 className="text-xl text-textSecondary">מערכת יצירת מסמכים</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">דוא״ל</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your.email@ortam.ai"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'מתחבר...' : 'התחברות'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-textSecondary">
            <p>מערכת פנימית לעובדי ORTAM AI בלבד</p>
          </div>
        </div>
      </div>
    </div>
  );
}
