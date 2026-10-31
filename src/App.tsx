import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Layers, FolderOpen, Menu, X, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from './auth/auth-context';

const NAV = [
  { to: '/', label: 'Thư viện mẫu', icon: Layers, end: true },
  { to: '/documents', label: 'Tài liệu của tôi', icon: FolderOpen, end: false },
];

const Mark: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className="shrink-0 text-accent"
  >
    <path
      d="M5 3.25h6.25L15 7v9.75H5z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M11.25 3.25V7H15" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path
      d="M7.5 10h5M7.5 12.75h5M7.5 15.5h3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const Brand: React.FC = () => (
  <>
    <Mark />
    <span className="min-w-0">
      <span className="block truncate text-[15px] font-semibold leading-5 tracking-[-0.01em] text-ink">
        Mẫu Văn Phòng
      </span>
      <span className="block truncate text-[12px] leading-4 text-muted">Thư viện DOCX &amp; PPTX</span>
    </span>
  </>
);

export const App: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <div className="min-h-screen bg-ground">
      {/* Phone: the frame folds into a 48px bar */}
      <div className="sticky top-0 z-30 flex h-12 items-center justify-between bg-ground px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Mở menu"
          className="flex h-9 w-9 items-center justify-center rounded-[6px] text-ink hover:bg-active"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <span className="text-[14px] font-semibold tracking-[-0.01em]">Mẫu Văn Phòng</span>
        <span className="w-9" aria-hidden="true" />
      </div>

      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[228px] lg:shrink-0 lg:flex-col lg:px-3 lg:py-5">
          <Link to="/" className="flex items-center gap-2.5 rounded-[6px] px-2 outline-offset-4">
            <Brand />
          </Link>

          <nav className="mt-7 flex flex-col gap-0.5" aria-label="Điều hướng chính">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex h-[34px] items-center gap-2.5 rounded-[6px] px-2 text-[14px] transition-colors',
                    isActive
                      ? 'bg-active font-medium text-ink'
                      : 'text-muted hover:bg-active/60 hover:text-ink',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-2 pb-2">
            <div className="rounded-[6px] border border-line bg-raised px-2.5 py-2">
              <p className="truncate text-[13px] font-medium text-ink">
                {user?.name}
              </p>
              <p className="truncate text-[11px] text-muted">
                {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'} · {user?.email}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-ink disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                {loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
              </button>
            </div>
            <p className="pt-2 text-[12px] leading-5 text-muted">
              Mỗi tài liệu là một bản sao độc lập, sinh ra từ mẫu gốc.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:p-2">
          <main className="min-h-[calc(100vh-48px)] bg-paper lg:min-h-[calc(100vh-16px)] lg:rounded-[16px] lg:border lg:border-line">
            <div className="mx-auto w-full max-w-[1280px] p-4 lg:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {navOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ground lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Điều hướng"
        >
          <div className="flex h-12 items-center justify-between px-4">
            <span className="text-[14px] font-semibold tracking-[-0.01em]">Mẫu Văn Phòng</span>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Đóng menu"
              className="flex h-9 w-9 items-center justify-center rounded-[6px] text-ink hover:bg-active"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-2.5 px-5 pb-2">
            <Mark />
            <span className="text-[12px] text-muted">Thư viện DOCX &amp; PPTX</span>
          </div>

          <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Điều hướng chính">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex h-11 items-center gap-3 rounded-[6px] px-3 text-[15px] transition-colors',
                    isActive
                      ? 'bg-active font-medium text-ink'
                      : 'text-muted hover:bg-active/60 hover:text-ink',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-5 pb-6">
            <div className="rounded-[6px] border border-line bg-raised px-3 py-2">
              <p className="truncate text-[14px] font-medium text-ink">
                {user?.name}
              </p>
              <p className="truncate text-[12px] text-muted">
                {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'} · {user?.email}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
              </button>
            </div>
            <p className="pt-3 text-[12px] leading-5 text-muted">
              Mỗi tài liệu là một bản sao độc lập, sinh ra từ mẫu gốc.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
