"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Spinner from "../_Dashboard_components/spinner";
import { useCookies } from "next-client-cookies";

const accentColors = [
    "#EA7A17", // orange
    "#00953A", // green
    "#E81178", // pink
];

export default function Home(){
    const cookie = useCookies();
const [products,setproducts] = useState("");
const [categories, setCategories] = useState("");
const [inquiries,setInquiries] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState(false);
const [errormsg, seterrormsg] = useState("");


useEffect(() => {
    async function fetchDashboardData() {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/summary/counts`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth'),

                },});
            const data = await res.json();

            
        setLoading(false);
        if (!res.ok) {
            seterrormsg(data.message || "Failed to fetch dashboard data");
            throw new Error(data.message || "Failed to fetch dashboard data");  
        }else{
            setproducts(data.products);
            setCategories(data.categories);
            setInquiries(data.unreadInquiries);
        setLoading(false);
            setError(false);
            seterrormsg("");

        }

        } catch (error) {
        setLoading(false);

        seterrormsg(error.message || "Failed to fetch dashboard data"  );
        }
    }
    fetchDashboardData();
}, []);

if (loading) {
    return <Spinner/>
}

if (error) {    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p>{error}</p>
            </div>
        </div>
    );}
    return (
        <div
            className="min-h-screen p-8 flex flex-col items-center justify-center  bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]"
        >
            {/* Dashboard Title and Welcome */}
            <h1 className="text-6xl font-bold mb-2 text-white">Dashboard</h1>
            <p className="text-3xl text-gray-300 mb-8">Welcome to your dashboard!</p>

            {/* Summary Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-5xl justify-items-center">
                {["Total Categories", "Total Products", "Total Inquiries"].map((label, i) => (
                    <div
                        key={label}
                        className="rounded-lg p-6 flex flex-col items-center shadow w-full"
                        style={{
                            background: "#111827",
                            borderTop: `4px solid ${accentColors[i]}`,
                            maxWidth: "320px",
                        }}
                    >
                        <span className="text-3xl font-bold mb-2" style={{ color: accentColors[i] }}>
                            {i === 0 ? categories : i === 1 ? products : inquiries}
                        </span>
                        <span className="text-gray-400 text-center">{label}</span>
                    </div>
                ))}
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl justify-items-center">
                {/* Team Table */}
                {/* <div
                    className="rounded-lg shadow p-6 flex flex-col items-center w-full"
                    style={{ background: "#111827", borderLeft: `4px solid ${accentColors[0]}`, maxWidth: "420px" }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: accentColors[0] }}>
                        Team
                    </h2>

                    {/* Table Scroll Wrapper */}
                    {/* <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-center">
                            <thead>
                                <tr>
                                    <th className="py-2 px-3 text-gray-400">Name</th>
                                    <th className="py-2 px-3 text-gray-400">Email</th>
                                    <th className="py-2 px-3 text-gray-400">Phone No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamData.map((member, idx) => (
                                    <tr key={idx} className="border-t" style={{ borderColor: "#27272a" }}>
                                        <td className="py-2 px-3">{member.name}</td>
                                        <td className="py-2 px-3">{member.email}</td>
                                        <td className="py-2 px-3">{member.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> */}

                {/* Clients Table */}
                {/* <div
                    className="rounded-lg shadow p-6 flex flex-col items-center w-full"
                    style={{ background: "#111827", borderLeft: `4px solid ${accentColors[2]}`, maxWidth: "420px" }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: accentColors[2] }}>
                        Clients
                    </h2>

                    {/* Table Scroll Wrapper */}
                    {/* <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-center">
                            <thead>
                                <tr>
                                    <th className="py-2 px-3 text-gray-400">Photo</th>
                                    <th className="py-2 px-3 text-gray-400">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientData.map((client, idx) => (
                                    <tr key={idx} className="border-t" style={{ borderColor: "#27272a" }}>
                                        <td className="py-2 px-3">
                                            <img
                                                src={client.photo}
                                                alt={client.name}
                                                className="w-10 h-10 rounded-full object-cover mx-auto"
                                                style={{ border: `2px solid ${accentColors[1]}` }}
                                            />
                                        </td>
                                        <td className="py-2 px-3">{client.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> */}

            </div>
        </div>
    );
}