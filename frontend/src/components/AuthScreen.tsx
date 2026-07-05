/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { UserSession } from "../types";
import { getProfile, loginUser, registerUser } from "../services/api";

interface AuthScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultEmail: string;
}

export default function AuthScreen({
  onLoginSuccess,
  defaultEmail,
}: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập địa chỉ email của bạn");
      return;
    }

    if (!password || password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự");
      return;
    }

    if (!isLogin) {
      if (!firstName || !lastName) {
        setError("Vui lòng nhập đầy đủ Họ và Tên");
        return;
      }
      if (!agreedToTerms) {
        setError("Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật");
        return;
      }
    }

    if (isLogin) {
      loginUser({ email, password })
        .then((apiRes) => {
          if (apiRes.success && apiRes.data && apiRes.data.token) {
            const token = apiRes.data.token;
            localStorage.setItem("token", token);

            return getProfile(token).then((profileRes) => {
              if (profileRes.success && profileRes.data) {
                const profile = profileRes.data;
                const nameParts = profile.username
                  ? profile.username.split(" ")
                  : ["Thành viên", ""];
                onLoginSuccess({
                  email: profile.email,
                  firstName: nameParts[0],
                  lastName: nameParts.slice(1).join(" "),
                  isLoggedIn: true,
                  role: profile.role,
                  username: profile.username,
                  token: token,
                });
              } else {
                throw new Error(
                  profileRes.message || "Không thể lấy thông tin tài khoản."
                );
              }
            });
          } else {
            throw new Error(apiRes.message || "Tên đăng nhập hoặc mật khẩu không chính xác.");
          }
        })
        .catch((err) => {
          setError(
            err.message ||
              "Lỗi kết nối. Vui lòng kiểm tra xem backend đã được khởi chạy chưa."
          );
        });
    } else {
      registerUser({
        username: `${firstName} ${lastName}`.trim(),
        email,
        password,
      })
        .then((apiRes) => {
          if (apiRes.success) {
            setIsLogin(true);
            setError(
              "Đăng ký thành công! Vui lòng đăng nhập bằng tài khoản mới của bạn."
            );
            setPassword("");
          } else {
            throw new Error(apiRes.message || "Đăng ký không thành công.");
          }
        })
        .catch((err) => {
          setError(
            err.message ||
              "Lỗi kết nối. Vui lòng kiểm tra xem backend đã được khởi chạy chưa."
          );
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative py-12 select-none overflow-hidden">
      {/* Decorative floating blurred background elements */}
      <div className="fixed top-20 right-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div
        className="fixed bottom-20 left-[10%] w-96 h-96 bg-primary-container/10 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative w-full max-w-[460px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl font-extrabold text-primary mb-2 tracking-tight">
            Manga Management System
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">
            Không gian làm việc chuyên nghiệp cho các tác giả Manga.
          </p>
        </div>

        {/* glass container */}
        <div className="glass-panel p-8 md:p-10 rounded-[24px] long-soft-shadow relative overflow-hidden bg-white/60">
          {isLogin ? (
            /* Login panel */
            <div>
              <div className="mb-6 relative">
                <h2 className="text-2xl font-bold text-on-surface mb-1">
                  Chào mừng quay trở lại
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Đăng nhập tài khoản để tiếp tục sáng tác.
                </p>
                <div className="absolute top-0 right-0 text-primary/20 pointer-events-none">
                  <Sparkles size={36} />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error-container/30 border border-error/20 text-error text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-on-surface-variant">
                      Mật khẩu
                    </label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-4 cursor-pointer text-sm"
                >
                  Đăng Nhập
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm text-on-surface-variant font-medium">
                  Chưa có tài khoản?{" "}
                </span>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className="text-sm text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ) : (
            /* Register panel */
            <div>
              <div className="mb-6 relative">
                <h2 className="text-2xl font-bold text-on-surface mb-1">
                  Bắt đầu sáng tác
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Tham gia cộng đồng họa sĩ manga chuyên nghiệp.
                </p>
                <div className="absolute top-0 right-0 text-primary/20 pointer-events-none">
                  <Sparkles size={36} />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error-container/30 border border-error/20 text-error text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant ml-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Lan"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant ml-1">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nguyễn"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nguyen@studio.com"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tạo mật khẩu an toàn"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <div className="flex items-start gap-3 py-1">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    id="terms-checkbox"
                    className="mt-1 w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary-container cursor-pointer"
                  />
                  <label
                    htmlFor="terms-checkbox"
                    className="text-xs text-on-surface-variant cursor-pointer"
                  >
                    Tôi đồng ý với{" "}
                    <span className="text-primary font-semibold hover:underline">
                      Điều khoản dịch vụ
                    </span>{" "}
                    và{" "}
                    <span className="text-primary font-semibold hover:underline">
                      Chính sách bảo mật
                    </span>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 cursor-pointer text-sm"
                >
                  Tạo Tài Khoản
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm text-on-surface-variant font-medium">
                  Đã có tài khoản?{" "}
                </span>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className="text-sm text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Đăng nhập tại đây
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer links */}
        <footer className="flex justify-center gap-6 mt-8">
          <a
            href="#"
            className="text-xs text-outline hover:text-primary transition-colors font-medium"
          >
            Trung tâm hỗ trợ
          </a>
          <a
            href="#"
            className="text-xs text-outline hover:text-primary transition-colors font-medium"
          >
            Bảo mật
          </a>
          <a
            href="#"
            className="text-xs text-outline hover:text-primary transition-colors font-medium"
          >
            Liên hệ
          </a>
        </footer>
      </div>
    </div>

  );
}
