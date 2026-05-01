import { useState } from "react";
import { FileText, Globe, LogOut, Shield, UserPlus, BarChart2 } from "lucide-react";
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
        <header className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-4 py-4 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
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
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F7B44]">
                    RUGAN
                  </p>
                  <h1 className="text-lg font-bold leading-tight text-[#101828]">
                    Content Management System
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
                  <p className="text-sm font-semibold text-[#101828]">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#667085]">
                    {user?.role}
                  </p>
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm font-medium text-[#344054] transition-colors hover:border-[#4F7B44] hover:text-[#4F7B44]"
                >
                  <Globe size={16} />
                  View site
                </a>

                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#101828] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D2939]"
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
                      ? "bg-[#E8F2E6] text-[#4F7B44]"
                      : "text-[#475467] hover:bg-[#EEF2EE] hover:text-[#4F7B44]",
                  )
                }
              >
                <FileText size={16} />
                Posts
              </NavLink>

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      cn(
                        navLinkBase,
                        isActive
                          ? "bg-[#E8F2E6] text-[#4F7B44]"
                          : "text-[#475467] hover:bg-[#EEF2EE] hover:text-[#4F7B44]",
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
                          ? "bg-[#E8F2E6] text-[#4F7B44]"
                          : "text-[#475467] hover:bg-[#EEF2EE] hover:text-[#4F7B44]",
                      )
                    }
                  >
                    <BarChart2 size={16} />
                    Analytics
                  </NavLink>
                </>
              )}

              <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm text-[#667085]">
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
