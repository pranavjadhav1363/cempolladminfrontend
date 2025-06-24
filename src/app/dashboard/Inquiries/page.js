"use client";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function InquiriesPage()
{
    const cookie = useCookies();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInquiries = async () =>
    {
        try
        {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/inquiry/inquiries`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookie.get("auth"),
                },
            });
            const data = await res.json();
            if (data.success)
            {
                setInquiries(data.data);
            } else
            {
                console.error(data.message || "Failed to fetch inquiries");
            }
        } catch (err)
        {
            console.error("Error fetching inquiries:", err);
        } finally
        {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (id) =>
    {
        try
        {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/inquiry/inquiry/toggle-read/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookie.get("auth"),
                },
            });
            const data = await res.json();
            if (data.success)
            {
                fetchInquiries();
            } else
            {
                console.error(data.message || "Failed to toggle read status");
            }
        } catch (error)
        {
            console.error("Error toggling read status:", error);
        }
    };

    useEffect(() =>
    {
        fetchInquiries();
    }, []);

const filteredInquiries = inquiries.filter((inq) => {
    const term = searchTerm.toLowerCase();
    return (
        inq?.Name?.toLowerCase().includes(term) ||
        inq?.EmailId?.toLowerCase().includes(term) ||
        inq?.PhoneNo?.toString().includes(term) ||   // ← convert to string first
        inq?.Inquiry?.toLowerCase().includes(term)
    );
});

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <h1
                className="text-3xl font-bold mb-6 text-center"
                style={{
                    color: "#EA7A17",
                    textShadow: "0 2px 8px rgba(232,17,120,0.2)",
                }}
            >
                User Inquiries
            </h1>

            <div className="max-w-md mx-auto mb-10">
                <input
                    type="text"
                    placeholder="Search by name, email, phone, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800 placeholder-gray-500 shadow"
                />
            </div>

            {loading ? (
                <div className="text-center text-pink-500">Loading...</div>
            ) : filteredInquiries.length === 0 ? (
                <div className="text-center text-pink-500">No inquiries found.</div>
            ) : (
                <div className="space-y-6">
                    {filteredInquiries.map((inq) => (
                        <div
                            key={inq._id}
                            className={`rounded-lg shadow p-6 border transition-all duration-300 ${inq.isRead
                                    ? "border-gray-600 opacity-60"
                                    : "border-[#00953A]"
                                }`}
                            style={{
                                background: "rgba(26,26,26,0.95)",
                            }}
                        >
                            <div className="mb-2">
                                <span className="font-semibold text-[#EA7A17]">Name:</span>{" "}
                                {inq.Name}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-[#00953A]">Email:</span>{" "}
                                {inq.EmailId}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-[#E81178]">Phone No:</span>{" "}
                                {inq.PhoneNo}
                            </div>
                            <div>
                                <span className="font-semibold text-[#EA7A17]">Message:</span>
                                <div className="mt-1 text-white">{inq.Inquiry}</div>
                            </div>

                            <div className="flex space-x-4 mt-4">
                                <button
                                    className="px-4 py-2 rounded font-semibold text-white"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #EA7A17 0%, #E81178 100%)",
                                    }}
                                    onClick={() => toggleReadStatus(inq._id)}
                                >
                                    Mark as {inq.isRead ? "Unread" : "Read"}
                                </button>

                                <Link
                                    href={`mailto:${inq.EmailId}?subject=Reply to your inquiry&body=Hi ${inq.Name},`}
                                    className="px-4 py-2 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 inline-block"
                                >
                                    Reply
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
