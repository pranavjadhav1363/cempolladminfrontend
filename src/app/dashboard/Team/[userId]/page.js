"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";

export default function TeamMemberViewPage()
{
    const { userId } = useParams();
    const cookie = useCookies();

    const [member, setMember] = useState(null);
    const [form, setForm] = useState({});
    const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() =>
    {
        if (!userId) return;
        const fetchMember = async () =>
        {
            try
            {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/rbac/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'auth-token': cookie.get('auth'),
                    },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to load user.");
                setMember(data.user);
                setForm({
                    name: data.user.Name || "",
                    email: data.user.EmailId || "",
                    phone: data.user.PhoneNo || ""
                });
            } catch (err)
            {
                setError(err.message || "Failed to load user data.");
            } finally
            {
                setLoading(false);
            }
        };
        fetchMember();
    }, [userId]);

    const handleEdit = () =>
    {
        setEditMode(true);
        setPasswords({ newPassword: "", confirmPassword: "" });
        setPasswordError("");
    };

    const handleCancel = () =>
    {
        setEditMode(false);
        setPasswords({ newPassword: "", confirmPassword: "" });
        setPasswordError("");
    };

    const handleChange = (e) =>
    {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) =>
    {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) =>
    {
        e.preventDefault();
        setError("");

        if (passwords.newPassword || passwords.confirmPassword)
        {
            if (passwords.newPassword !== passwords.confirmPassword)
            {
                setPasswordError("Passwords do not match.");
                return;
            }
        }

        try
        {
            const payload = {
                NewName: form.name,
                newemailid: form.email,
                newPhoneo: form.phone,
                newPassword: passwords.newPassword || undefined
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/rbac/update-user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': cookie.get('auth'),
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update user.");
            if (res.status === 403)
            {
                setError("You are not authorized to view this page.");
                return
            }
            setMember({
                ...member,
                Name: form.name,
                EmailId: form.email,
                PhoneNo: form.phone
            });

            setEditMode(false);
        } catch (err)
        {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center text-white py-20">Loading...</div>;
    // if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

    return (
        <div className="min-h-screen bg-[#18181b] text-white flex items-center justify-center py-10 bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="w-full max-w-lg bg-[#232326] rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-[#EA7A17]">Team Member Details</h2>

                {!editMode ? (
                    <div>
                        <div className="mb-4">
                            <span className="block text-[#E81178] font-semibold">Name:</span>
                            <span>{member?.Name}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-[#E81178] font-semibold">Email:</span>
                            <span>{member?.EmailId}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-[#E81178] font-semibold">Phone:</span>
                            <span>{member?.PhoneNo}</span>
                        </div>
                        <button
                            className="mt-6 px-6 py-2 rounded bg-[#00953A] hover:bg-[#007c2f] text-white font-semibold transition"
                            onClick={handleEdit}
                        >
                            Edit Details
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSave}>
                        {error && (
                            <div className="text-red-500 mb-4">{error}</div>
                        )}
                        <div className="mb-4">
                            <label className="block text-[#E81178] font-semibold mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#EA7A17] text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#E81178] font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#EA7A17] text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#E81178] font-semibold mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#EA7A17] text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#E81178] font-semibold mb-1">Change Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="New Password"
                                className="w-full px-3 py-2 mb-2 rounded bg-[#18181b] border border-[#EA7A17] text-white"
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm Password"
                                className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#EA7A17] text-white"
                            />
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="accent-[#EA7A17] mr-2"
                                />
                                <label htmlFor="showPassword" className="text-sm text-[#EA7A17]">Show Passwords</label>
                            </div>
                            {passwordError && (
                                <div className="text-[#E81178] text-sm mt-1">{passwordError}</div>
                            )}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 rounded bg-[#00953A] hover:bg-[#007c2f] text-white font-semibold transition"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 rounded bg-[#E81178] hover:bg-[#b80a5c] text-white font-semibold transition"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
