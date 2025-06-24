"use client";
import React, { useState } from 'react';
import Spinner from '../../_Dashboard_components/spinner';
import Frommessage from '../../_Dashboard_components/frommessage';
import { useCookies } from 'next-client-cookies';

const AddCategory = () =>
{
    const cookie = useCookies();
    const [categoryName, setCategoryName] = useState("");
    const [categoryDesc, setCategoryDesc] = useState(""); // New state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successful, setSuccessful] = useState(false);

    const handleSubmit = async (e) =>
    {
        console.log("Submitting category with Name:", categoryName, "and Description:", categoryDesc);
        e.preventDefault();
        // setLoading(true);
        setError("");
        setSuccessful(false);

        try
        {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/create-category`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth')
                },
                body: JSON.stringify({
                    CategoryName: categoryName,
                    CategoryDesc: categoryDesc // Include desc in API body
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to create category');

            setCategoryName("");
            setCategoryDesc("");
            setSuccessful(true);
        } catch (err)
        {
            setError(err.message);
        } finally
        {
            setLoading(false);
        }
    }

    // if (loading) return <Spinner />;

    return (
        <div className="min-h-screen flex items-center  bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="max-w-md mx-auto p-8 rounded-lg shadow-lg bg-[#1e1e1e]">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#EA7A17]">Create Category</h2>

                {error && <Frommessage msg={error} color="red" />}
                {successful && <Frommessage msg="Category Created Successfully" color="green" />}

                <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="mb-6">
                        <label className="block text-[#E81178] font-semibold mb-2">
                            Category Name:
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={e => setCategoryName(e.target.value)}
                            className="w-full mt-1 px-4 py-2 rounded bg-[#232326] text-white border border-[#EA7A17] focus:outline-none focus:ring-2 focus:ring-[#00953A]"
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    {/* Category Description */}
                    <div className="mb-6">
                        <label className="block text-[#E81178] font-semibold mb-2">
                            Category Description:
                        </label>
                        <textarea
                            value={categoryDesc}
                            onChange={e => setCategoryDesc(e.target.value)}
                            className="w-full mt-1 px-4 py-2 rounded bg-[#232326] text-white border border-[#EA7A17] focus:outline-none focus:ring-2 focus:ring-[#00953A]"
                            placeholder="Enter category description"
                            rows={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded bg-gradient-to-r from-[#00953A] to-[#00953A] text-white font-bold hover:opacity-90 transition"
                    >
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
