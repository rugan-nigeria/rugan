import { useState } from "react";
import { FileText, Globe, LogOut, Shield, UserPlus, BarChart2, Mail } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";

const navLinkBase =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  function handleSignOut() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <>
      <ConfirmDialog
        open={showSignOutConfirm}
        title="Sign out?"
        description="Your current admin session will end on this device."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        tone="neutral"
        onCancel={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />

      <div className="min-h-screen bg-[#F7F8F6]">
        <header className="border-b border-[#3D6235] bg-[#4F7B44]">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-4 py-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/icons/rugan-logo.jpg"
                    alt="RUGAN"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(event) => {
                      event.target.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    RUGAN
                  </p>
                  <h1 className="text-lg font-bold leading-tight text-white">
                    Content Management System
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-lg border border-[#3D6235] bg-[#3D6235]/50 px-3 py-2">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/70">
                    {user?.role}
                  </p>
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/40"
                >
                  <Globe size={16} />
                  View site
                </a>

                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#4F7B44] transition-colors hover:bg-gray-100 shadow-sm"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>

            <nav className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 whitespace-nowrap">
              <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                  cn(
                    navLinkBase,
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )
                }
              >
                <FileText size={16} />
                Posts
              </NavLink>

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/broadcasts"
                    className={({ isActive }) =>
                      cn(
                        navLinkBase,
                        isActive
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )
                    }
                  >
                    <Mail size={16} />
                    Broadcasts
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      cn(
                        navLinkBase,
                        isActive
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )
                    }
                  >
                    <UserPlus size={16} />
                    Users
                  </NavLink>

                  <NavLink
                    to="/admin/analytics"
                    className={({ isActive }) =>
                      cn(
                        navLinkBase,
                        isActive
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )
                    }
                  >
                    <BarChart2 size={16} />
                    Analytics
                  </NavLink>
                </>
              )}

              <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/80">
                <Shield size={16} />
                Admin and editors can author and publish
              </span>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1320px] px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
