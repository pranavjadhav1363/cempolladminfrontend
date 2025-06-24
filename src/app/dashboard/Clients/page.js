"use client";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import Spinner from "../_Dashboard_components/spinner";
import ErrorMSg from "../_Dashboard_components/errormsg";
import Link from "next/link";


const clientsData = [
    {
        id: 1,
        name: "Acme Corp",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        name: "Globex Inc",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 3,
        name: "Umbrella LLC",
        image: "https://randomuser.me/api/portraits/men/65.jpg",
    },
];

export default function ClientsPage()
{
    const cookie = useCookies();
    const [search, setSearch] = useState("");
    const [clients, setClients] = useState(clientsData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ButtonLoading, setButtonLoading] = useState(false);

    const handleDelete = async(id) =>
    {
        try {
        setButtonLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/client/delete/${id}`, {
                method: 'Delete',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth'),

                },
        
        });

        const data = await response.json();

        if (response.ok && data.success) {
       
        } else {
            setError(data.message || "Failed to delete client.");
            console.error(data.message || "Failed to delete image.");
        }
    } catch (error) {
        setError(data.message || "Failed to delete client.");
        console.error("Internal server error:", error);
    }finally
    {
        setButtonLoading(false);
        setClients((prev) => prev.filter((c) => c._id !== id));
    }
    };

    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    useEffect(() =>
    {
        const fetchClients = async () =>
        {
            setLoading(true);
            setError('');
            try
            {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/client/all-clients`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': cookie.get('auth'),

                    },
                });
                const data = await res.json();
                if (data.success)
                {
                    setClients(data.clients);
                }
            } catch (err)
            {
                setError(err.message || "Failed to fetch clients");
                // Optionally handle error
                console.error("Failed to fetch clients:", err);
            } finally
            {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);
    if (loading)
    { 
        return <Spinner/>
      }
      if (error)
      {
        return <ErrorMSg err={error}/>
        
      }
    return (
        <div className=" bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17] min-h-screen bg-gray-900 text-white px-6 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex w-full sm:w-auto gap-2">
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EA7A17] w-full"
                        />
                        <button
                            className="bg-[#00953A] hover:bg-[#007c30] text-white px-4 py-2 rounded transition"
                            onClick={() => { }}
                        >
                            Search
                        </button>
                    </div>
                    <Link href="/dashboard/Clients/add" className="bg-[#EA7A17] hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold transition">
                        + Add Client
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filteredClients.map((client, id) => (
                        <div
                            key={client._id || id}
                            className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                src={client.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={client.name}
                                onError={(e) =>
                                {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                                }}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex justify-between items-center">
                                <h3 className="text-white font-semibold truncate">{client.name}</h3>
                                <button
                                disabled={ButtonLoading}
                                    onClick={() => handleDelete(client._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                                >
                                      {ButtonLoading ? "..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredClients.length === 0 && (
                        <div className="col-span-full text-center text-gray-400">
                            No clients found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
