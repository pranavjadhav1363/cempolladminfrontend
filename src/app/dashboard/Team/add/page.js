"use client";
import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function AddTeamMember() {
    const cookie = useCookies();

    const [form, setForm] = useState({
        Name: "",
        PhoneNo: "",
        EmailId: "",
        Role: "manager",
        Password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/rbac/assign-role`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                      'auth-token': cookie.get('auth'),
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (response.status === 403) {
                setError("You are not authorized to perform this action.");
                return;
            }

            if (response.ok && data.success) {
                setMessage("Team member added successfully!");
                setForm({
                    Name: "",
                    PhoneNo: "",
                    EmailId: "",
                    Role: "manager",
                    Password: "",
                });
            } else {
                setError(data.message || "Failed to add team member.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div className="min-h-screen bg-[#18181b] flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-[#232326] border border-[#2d2d31]">
                <h1 className="text-3xl font-bold mb-6 text-center text-[#EA7A17]">
                    Add Team Member
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Name" name="Name" value={form.Name} onChange={handleChange} borderColor="#EA7A17" />
                    <Input label="Phone Number" name="PhoneNo" type="number" value={form.PhoneNo} onChange={handleChange} borderColor="#00953A" />
                    <Input label="Email ID" name="EmailId" type="email" value={form.EmailId} onChange={handleChange} borderColor="#E81178" />
                    <div>
                        <label className="block mb-1 text-[#EA7A17] font-medium">Role</label>
                        <select
                            name="Role"
                            value={form.Role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#EA7A17] text-white focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <Input label="Password" name="Password" type="password" value={form.Password} onChange={handleChange} borderColor="#00953A" />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded bg-gradient-to-r from-[#EA7A17] via-[#E81178] to-[#00953A] text-white font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Member"}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-center text-green-500 font-semibold">{message}</div>
                )}
                {error && (
                    <div className="mt-4 text-center text-red-500 font-semibold">{error}</div>
                )}
            </div>
        </div>
    );
}

// Reusable input component
function Input({ label, name, type = "text", value, onChange, borderColor }) {
    return (
        <div>
            <label className={`block mb-1 font-medium`} style={{ color: borderColor }}>
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
                className={`w-full px-3 py-2 rounded bg-[#18181b] border text-white focus:outline-none focus:ring-2`}
                style={{
                    borderColor: borderColor,
                    boxShadow: `0 0 0 0 rgba(0,0,0,0)`,
                }}
            />
        </div>
    );
}
