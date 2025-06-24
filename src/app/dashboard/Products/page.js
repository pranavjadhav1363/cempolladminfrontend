"use client";
import { useCookies } from "next-client-cookies";
import React, { useState, useEffect } from "react";
import Spinner from "../_Dashboard_components/spinner";
import ErrorMSg from "../_Dashboard_components/errormsg";
import Link from "next/link";



const COLORS = {
    orange: "#EA7A17",
    green: "#00953A",
    pink: "#E81178",
    bg: "#18181b",
    card: "#232326",
    text: "#f3f4f6",
};

export default function ProductsPage()
{
    const cookie = useCookies();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() =>
    {

        const fetchProducts = async () =>
        {
            try
            {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/product/list-products`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'auth-token': cookie.get('auth'),
                    },
                    // credentials: "include", // if your auth uses cookies
                });
                const data = await response.json();
                console.log(data, "data");
                if (data.success)
                {
                    setProducts(data.products);


                } else
                {
                setError("Failed to fetch products. Please try again later.");

                    setProducts([]);
                }
            } catch (error)
            {
                setError("Failed to fetch products. Please try again later.");
                setProducts([]);
            } finally
            {
                setLoading(false);
            }
        };

        fetchProducts();


    }, []);

    const filtered = products.filter((p) =>
        p.ProductName.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async(id) =>
    {
        // Replace with API call
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/product/delete-product/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": cookie.get("auth"),
            },
            });
            const data = await res.json();
            if (!data.success) {
            setError("Failed to delete product.");
            } else {
            setProducts((prev) => prev.filter((p) => p._id !== id));
            }
        } catch {
            setError("Failed to delete product.");
        }
    };
    if (loading)
    {
        return <Spinner />
    }
    if (error) {
        return <ErrorMSg/>
    }
    return (
        <div
            className="min-h-screen px-6 py-8 bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]"
           
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold" style={{ color: COLORS.orange }}>
                    Products
                </h1>
                 <Link
                    href="/dashboard/Products/add"
                    className="bg-[#EA7A17] hover:bg-[#E81178] text-white font-bold py-2 px-6 rounded transition-colors inline-block text-center"
                >
                    Add Product
                </Link>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-[#232326] text-gray-100 border-none focus:ring-2 focus:ring-[#EA7A17] outline-none"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg overflow-hidden">
                    <thead>
                        <tr style={{ background: COLORS.card }}>
                            <th className="px-4 py-3 text-left">Image</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Description</th>
                            {/* <th className="px-4 py-3 text-left">TDS</th> */}
                            <th className="px-4 py-3 text-left">Features</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((product) => (
                                <tr
                                    key={product?._id}
                                    className="border-b border-[#232326] hover:bg-[#232326]/60 transition"
                                >
                                    <td className="px-4 py-3">
                                        <img
                                            src={product?.ProductImage}
                                            alt={product?.ProductName}
                                            className="w-16 h-16 object-cover rounded-md border-2"
                                            // style={{ borderColor: COLORS.orange }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{product?.ProductName}</td>
                                    <td className="px-4 py-3  font-semibold max-w-xs truncate">
                                        {product?.ProductDescription?.length > 30
                                            ? product.ProductDescription.slice(0, 30) + "..."
                                            : product.ProductDescription}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={product?.ProductTDS}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View TDS
                                        </a>
                                    </td>

                                    <td className="px-4 py-3 flex gap-2">
                                        <Link
                                            href={`/dashboard/Products/${product._id}`}
                                            className="px-3 py-1 rounded bg-[#E81178] text-white font-medium hover:bg-pink-700 transition"
                                  
                                        >
                                            View
                                        </Link>
                                        <button
                                            className="px-3 py-1 rounded bg-[#EA7A17] text-white font-medium hover:bg-orange-700 transition"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}