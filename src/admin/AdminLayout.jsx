import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ExternalLink, FolderTree, Inbox, LayoutDashboard, LogOut, Menu, Package, RotateCcw, Settings, X } from 'lucide-react';
import Logo from '../components/ui/Logo';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

export function AdminPageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

function Sidebar({ onNavigate, onReset, onLogout }) {
  const { enquiries } = useStore();
  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const items = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, badge: newCount },
    { to: '/admin/settings', label: 'Site settings', icon: Settings },
  ];
  const linkCls = 'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition';

  return (
    <div className="flex h-full flex-col bg-brand-deeper text-white/75">
      <div className="flex h-[72px] items-center border-b border-white/10 px-5">
        <Logo light tagline={false} size="sm" />
        <span className="ml-3 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">Admin panel</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        <p className="px-3.5 pb-2 pt-3 text-[11px] font-bold uppercase tracking-wider text-white/40">Menu</p>
        {items.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => cn(linkCls, isActive ? 'bg-accent text-white shadow-[0_8px_20px_-8px_rgba(249,115,22,0.7)]' : 'hover:bg-white/5 hover:text-white')}
          >
            {({ isActive }) => (
              <>
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', isActive ? 'bg-white text-accent' : 'bg-accent text-white')}>
                    {badge}
                    <span className="sr-only"> new</span>
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className={cn(linkCls, 'hover:bg-white/5 hover:text-white')}>
          <ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" /> View website
        </a>
        <button type="button" onClick={onReset} className={cn(linkCls, 'hover:bg-white/5 hover:text-white')}>
          <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" /> Reset demo data
        </button>
        <button type="button" onClick={onLogout} className={cn(linkCls, 'hover:bg-red-500/15 hover:text-red-200')}>
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" /> Log out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { session, logout, resetDemo } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  if (!session) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    logout();
    toast('You have been logged out', 'info');
    navigate('/admin', { replace: true });
  };

  const handleReset = () => {
    resetDemo();
    setConfirmReset(false);
    setMobileOpen(false);
    toast('Demo data restored to the original products, categories and enquiries');
  };

  const sidebarProps = { onNavigate: () => setMobileOpen(false), onReset: () => setConfirmReset(true), onLogout: handleLogout };

  return (
    <div className="min-h-screen bg-soft">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar {...sidebarProps} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fade-in absolute inset-0 bg-brand-deeper/60" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="slide-in-left absolute inset-y-0 left-0 w-72 max-w-[85vw]" role="dialog" aria-modal="true" aria-label="Admin menu">
            <Sidebar {...sidebarProps} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-ink hover:bg-soft" aria-label="Open menu" aria-expanded={mobileOpen}>
            <Menu className="h-6 w-6" />
          </button>
          <Logo tagline={false} size="sm" />
          <span className="w-10" />
        </header>
        <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="Reset demo data?"
        tone="warning"
        confirmLabel="Reset data"
        message={
          <>
            All products, categories, enquiries and site settings will be restored to the original demo data. Any changes you made — including
            uploaded photos and new enquiries — will be lost. <strong className="text-ink">This cannot be undone.</strong>
          </>
        }
      />
    </div>
  );
}
