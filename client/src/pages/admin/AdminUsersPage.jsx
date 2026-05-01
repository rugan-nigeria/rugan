import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Eye, EyeOff, Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "editor",
  isActive: true,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await api.get("/auth/users");
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingUserId) {
        await api.put(`/auth/users/${editingUserId}`, form);
        toast.success("User updated.");
      } else {
        await api.post("/auth/register", form);
        toast.success("User created.");
      }
      setForm(EMPTY_FORM);
      setEditingUserId(null);
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not ${editingUserId ? "update" : "create"} user.`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(user) {
    setEditingUserId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      password: "", // Don't populate password
      role: user.role,
      isActive: user.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingUserId(null);
    setForm(EMPTY_FORM);
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-[380px_1fr] items-start">
      <section className="relative lg:sticky top-6 rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-lg font-bold text-[#101828]">
            {editingUserId ? "Edit user" : "Create user"}
          </h2>
          <p className="text-sm text-[#667085]">
            {editingUserId ? "Update user details or reset password." : "Admins can create editor and admin accounts for the CMS."}
          </p>
        </div>

        <form className="space-y-5 px-5 py-5" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Full name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">
              Password {editingUserId && <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(leave blank to keep current)</span>}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                minLength={8}
                required={!editingUserId}
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={form.role}
              onChange={(event) => updateForm("role", event.target.value)}
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {editingUserId && (
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={form.isActive ? "true" : "false"}
                onChange={(event) => updateForm("isActive", event.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {editingUserId && (
              <Button type="button" variant="outline-green" onClick={cancelEdit} disabled={submitting} className="w-full">
                Cancel
              </Button>
            )}
            <Button type="submit" variant="green" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Saving..." : editingUserId ? "Update user" : "Create user"}
            </Button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-lg font-bold text-[#101828]">Authorized users</h2>
          <p className="text-sm text-[#667085]">
            Current admins and editors with CMS access.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#667085]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#667085]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-4 text-sm font-medium text-[#101828]">{user.name}</td>
                    <td className="px-5 py-4 text-sm text-[#475467]">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-[#475467]">{user.role}</td>
                    <td className="px-5 py-4 text-sm text-[#475467]">
                      {user.isActive ? "Active" : "Disabled"}
                    </td>
                    <td className="px-5 py-4 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#4F7B44", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "0.375rem" }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
