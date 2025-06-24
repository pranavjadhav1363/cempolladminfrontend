"use client";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeamPage() {
    const cookie = useCookies();
    const [search, setSearch] = useState("");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch team members
    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/rbac/all-users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'auth-token': cookie.get('auth'),
                    },
                });
                const data = await res.json();
                if (res.status === 403) {
                    setError("You are not authorized to view this page.");
                    return
                }
                if (res.ok && data.success) {
                    setMembers(data.users);
                } else {
                    console.log(res)
                    setError(data.message || "Failed to load team members.");
                }
            } catch (err) {
                console.error("Error fetching team members:", err);
                setError("Something went wrong while fetching users.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            setDeletingId(id);
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/rbac/delete-user/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': cookie.get('auth'),
                },
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setMembers((prev) => prev.filter((member) => member._id !== id));
            } else {
                 setError("Something went wrong while fetching users.");
                // alert(data.message || "Failed to delete user.");
            }
        } catch (err) {
            setError("Something went wrong while fetching users.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMembers = members.filter((member) =>
        `${member.Name} ${member.Role} ${member.EmailId} ${member.PhoneNo}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#18181b] px-6 py-10 bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <h1 className="text-3xl font-bold mb-8 text-[#EA7A17]">Team Members</h1>

            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search team members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg bg-[#232326] text-white border border-[#EA7A17] focus:outline-none focus:ring-2 focus:ring-[#E81178] transition"
                />
                <Link
                    href="/dashboard/Team/add"
                    className="px-4 py-2 bg-[#EA7A17] text-white rounded-lg font-semibold hover:bg-[#cc650f] transition"
                >
                    + Add Member
                </Link>
            </div>

            {loading ? (
                <div className="text-center text-white">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-[#232326] text-white">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#EA7A17]">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#00953A]">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#E81178]">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#EA7A17]">Phone</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        No team members found.
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member) => (
                                    <tr key={member._id} className="border-b border-[#2d2d31] hover:bg-[#232326]/80 transition">
                                        <td className="px-6 py-4">{member.Name}</td>
                                        <td className="px-6 py-4 text-[#00953A]">{member.Role}</td>
                                        <td className="px-6 py-4">{member.EmailId}</td>
                                        <td className="px-6 py-4">{member.PhoneNo}</td>
                                        <td className="px-6 py-4 flex gap-3 justify-center">
                                            <Link
                                                href={`/dashboard/Team/${member._id}`}
                                                className="px-4 py-1 rounded bg-[#00953A] hover:bg-[#007a2c] text-white font-semibold transition"
                                                // onClick={() => alert(`Viewing ${member.Name}`)}
                                            >
                                                View
                                            </Link>
                                            <button
                                                className="px-4 py-1 rounded bg-[#E81178] hover:bg-[#b10c5a] text-white font-semibold transition"
                                                onClick={() => handleDelete(member._id)}
                                                disabled={deletingId === member._id}
                                            >
                                                {deletingId === member._id ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
