import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, KeyRound, LogIn } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Field from '../components/ui/Field';
import PhotoBackdrop from '../components/ui/PhotoBackdrop';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

const DEMO = { username: 'admin', password: 'admin123' };

export default function AdminLogin() {
  const { session, login } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  if (session) return <Navigate to="/admin/dashboard" replace />;

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors({});
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.username.trim()) next.username = 'Enter your username';
    if (!form.password) next.password = 'Enter your password';
    if (!next.username && !next.password && (form.username.trim() !== DEMO.username || form.password !== DEMO.password)) {
      next.password = 'Incorrect username or password';
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    login(DEMO.username);
    toast('Welcome back, admin');
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="hero-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <PhotoBackdrop src="/images/cnc-machining-centre.jpg" fade="soft" />
      <div className="relative w-full max-w-[420px]">
        <div className="pop-in rounded-2xl bg-white p-7 shadow-float sm:p-9">
          <Logo />
          <h1 className="mt-8 text-2xl font-extrabold">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage orders, products, categories and enquiries.</p>

          <form onSubmit={submit} noValidate className="mt-7 space-y-4">
            <Field label="Username" name="username" value={form.username} onChange={update('username')} error={errors.username} autoComplete="username" autoFocus />
            <div className="relative">
              <Field
                label="Password"
                name="password"
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                error={errors.password}
                autoComplete="current-password"
                className="[&_input]:pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-[30px] rounded-md p-1.5 text-muted hover:text-ink"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full">
              <LogIn className="h-4 w-4" aria-hidden="true" /> Sign in
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-accent/60 bg-accent-tint p-4 text-sm">
            <p className="flex items-center gap-2 font-bold text-ink">
              <KeyRound className="h-4 w-4 text-accent" aria-hidden="true" /> Demo credentials
            </p>
            <p className="mt-1.5 text-muted">
              Username <code className="rounded bg-white px-1.5 py-0.5 font-semibold text-ink">admin</code> · Password{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-semibold text-ink">admin123</code>
            </p>
            <button type="button" className="mt-2 text-xs font-bold text-accent hover:underline" onClick={() => setForm({ ...DEMO })}>
              Fill in for me
            </button>
          </div>
        </div>
        <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to website
        </Link>
      </div>
    </div>
  );
}
