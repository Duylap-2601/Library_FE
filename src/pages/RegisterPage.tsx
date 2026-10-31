import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuth } from '../auth/auth-context';

export const RegisterPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await authApi.register({ name, email, password });
      setUser(response.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ground px-4">
      <div className="w-full max-w-[380px] rounded-[10px] border border-line bg-paper p-6 shadow-sm">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">
          Tạo tài khoản
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          Bắt đầu tạo tài liệu từ thư viện mẫu.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Họ tên
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field mt-1"
            />
            <p className="mt-1 text-[11px] text-muted">Tối thiểu 8 ký tự.</p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] leading-5 text-[#991b1b]"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? 'Đang tạo…' : 'Tạo tài khoản'}
          </button>
        </form>

        <p className="mt-4 text-center text-[12px] text-muted">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
