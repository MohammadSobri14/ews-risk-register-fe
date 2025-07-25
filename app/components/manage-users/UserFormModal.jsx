import { useEffect, useState } from "react";
import { addUser, editUser } from "../../lib/userApi";

export default function UserFormModal({
  isOpen,
  onClose,
  onUserSaved,
  editingUser = null,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || "",
        email: editingUser.email || "",
        password: "",
        confirmPassword: "",
        role: editingUser.role || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Hapus error jika ada untuk field ini
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Harus diisi";
    }
    if (!form.email.trim()) {
      newErrors.email = "Harus diisi";
    }
    if (!editingUser) {
      if (!form.password) {
        newErrors.password = "Harus diisi";
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Harus diisi";
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password tidak cocok";
      }
    }
    if (!form.role) {
      newErrors.role = "Harus diisi";
    }

    setErrors(newErrors);

    // Jika ada error return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      if (editingUser) {
        await editUser(editingUser.id, form);
      } else {
        await addUser(form);
      }
      onUserSaved(!!editingUser);
      onClose();
    } catch (err) {
      alert("Gagal menyimpan user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow w-full max-w-lg mx-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {editingUser ? "Perbarui Pengguna" : "Tambah Pengguna Baru"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div className="my-5">
            <label className="block text-sm font-bold mb-1 text-gray-800">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="eg: John Doe"
              className={`w-full bg-[#f7faff] text-gray-700 placeholder:text-gray-200 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2
              ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="eg: john@gmail.com"
              className={`w-full bg-[#f7faff] text-gray-700 placeholder:text-gray-200 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2
              ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-800">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              autoComplete="new-password"
              className={`w-full bg-[#f7faff] text-gray-700 placeholder:text-gray-200 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2
              ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-800">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Your Password"
              className={`w-full bg-[#f7faff] text-gray-700 placeholder:text-gray-200 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2
              ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-800">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`w-full border text-gray-700 px-4 py-2 rounded-lg hover:cursor-pointer bg-white focus:outline-none focus:ring-2
              ${
                errors.role
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="">-- Select Role --</option>
              {[
              "koordinator_unit",
              "koordinator_menris",
              "koordinator_mutu",
              "kepala_puskesmas",
              "dinas_kesehatan",
              "admin",
            ].map((role) => (
              <option key={role} value={role}>
                {role === "koordinator_menris"
                  ? "Koordinator Manrisk"
                  : role
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}

            </select>
            {errors.role && (
              <p className="text-red-600 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end pt-4 w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition duration-300 ease-in-out"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-[90px] h-[42px] text-sm text-blue-600 bg-transparent border border-blue-500 rounded-lg transition duration-300 ease-in-out hover:text-blue hover:bg-blue-100
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-[#397bf4] hover:bg-[#2f6ce0] cursor-pointer"
                }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2 text-xs">
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  ...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
