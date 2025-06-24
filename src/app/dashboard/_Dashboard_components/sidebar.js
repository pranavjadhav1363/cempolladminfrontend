"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from 'next-client-cookies';
import cempoll_logo from "../../_utils/cempoll_logo.jpeg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import spinner from "./spinner";
import Spinner from "./spinner";
const Sidebar = () =>
{
    const cookie = useCookies();

    const [User, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter()

    const logout = async () =>
    {
        console.log("Logging out...");
        cookie.remove('auth'); // Remove auth cookie
        cookie.remove('role'); // Remove role cookie
        navigate.replace("/"); // Redirect to login page
        console.log("Logged out successfully");
    }
    useEffect(() =>
    {
        const fetchUser = async () =>
        {
            try
            {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/auth/get-user`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': cookie.get('auth')
                    }
                });
                const data = await res.json();
                if (data.success)
                {
                    console.log("User fetched successfully:", data.user);
                    console.log("User data:", data);
                    setUser(data.user);

                } else
                {
                    navigate.replace("/")// Redirect to login if not authenticated
                }
                setLoading(false);
            } catch (err)
            {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);
    const [isOpen, setIsOpen] = useState(true);
    const cookies = useCookies();
    console.log(cookies.get('auth')
    )
    const user = { name: "Pranav" };
    const logoUrl = "../";

    const menu = [
        {
            name: "Home",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
            ),
            path: "/dashboard/Home",
        },
        {
            name: "Category",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            path: "/dashboard/Categories",
        },
        {
            name: "Inquiries",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="24"
                    height="24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.6A8 8 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            path: "/dashboard/Inquiries",
        },
        {
            name: "Clients",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="24"
                    height="24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5V3h6v2M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
            ),
            path: "/dashboard/Clients",
        },
        {
            name: "Gallery",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="24"
                    height="24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4a3 3 0 014 0l4 4m4-10v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2z" />
                </svg>
            ),
            path: "/dashboard/Gallery",
        },
        {
            name: "Team",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="24"
                    height="24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M4 20h5v-2a4 4 0 00-3-3.87M15 11a4 4 0 10-6 0M21 16v-1a4 4 0 00-3-3.87M3 16v-1a4 4 0 013-3.87" />
                </svg>

            ),
            path: "/dashboard/Team",
        },
        {
            name: "Products",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="24"
                    height="24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 9.5L12 14 3.5 9.5M20.5 9.5v5a2 2 0 01-1 1.73l-7.5 4.33-7.5-4.33A2 2 0 013.5 14.5v-5M20.5 9.5L12 5 3.5 9.5" />
                </svg>
            ),
            path: "/dashboard/Products",
        },
    ];

    const accentColors = ["#EA7A17", "#00953A", "#E81178", "#00953A", "#EA7A17", "#EA7A17", "#00953A", "#E81178", "#00953A", "#EA7A17"];
    if (loading)
    {
        return (
            <Spinner />
        );
    }


    return (
        <>
            {/* Toggle Button (Mobile only) */}
            <button
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#232326] text-white hover:bg-[#2d2d31] transition md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isOpen ? (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen z-40 flex flex-col w-64 bg-[#18181b] text-white shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:static md:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center h-24 border-b border-white/10">
                    <Image
                        src={cempoll_logo}
                        alt="Cempoll Logo"
                        width={"auto"}
                        height={"auto"}
                        className="rounded-full object-cover"
                    />
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center py-6 border-b border-white/10">
                    <div
                        className="w-16 h-16 rounded-full bg-[#232326] flex items-center justify-center text-2xl font-bold mb-2"
                        style={{ color: "#EA7A17" }}
                    >
                        {User?.Name?.[0]}
                    </div>
                    <span className="text-lg font-semibold">{User?.Name}</span>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 px-4 space-y-2">
                    {menu.map((item, idx) =>
                    {
                        if (item.name === "Team" && cookies.get('role') !== 'admin')
                        {
                            return null; // Hide Team if not admin
                        }

                        return (
                            <Link key={item.name} href={item.path}>
                                <div
                                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 group hover:bg-[#232326] hover:text-white cursor-pointer`}
                                >
                                    <span
                                        className="mr-3"
                                        style={{ color: accentColors[idx] }}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}

                </nav>
                {/* /* Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-[#232326] transition-colors duration-200 hover:text-[#E81178]"
                        onClick={logout}
                    >
                        <svg
                            className="w-5 h-5 mr-3 text-[#E81178]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
