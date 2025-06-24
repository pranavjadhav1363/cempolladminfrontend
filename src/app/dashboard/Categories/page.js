"use client";
import Link from 'next/link'
import { useCookies } from 'next-client-cookies';
import React, { useEffect } from 'react'
import Spinner from '../_Dashboard_components/spinner';
import ErrorMSg from '../_Dashboard_components/errormsg';

const CategoryPage = () =>
{
    const cookie = useCookies();

    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [buttonLoading, setbuttonLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    useEffect(() =>
    {
        const fetchCategories = async () =>
        {
            setLoading(true);
            setError(null);
            try
            {
                // throw new Error(result.message || 'Failed to fetch categories')
                const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/categories`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': cookie.get('auth')
                    }
                }
                );
                if (!res.ok) throw new Error('Failed to fetch categories');
                const result = await res.json();
                console.log(result);
                if (!result.success);
                setCategories(result.categories || []);
                console.log(result.categories);
            } catch (err)
            {
                setError(err.message);
            } finally
            {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);


    const handledelete = async (e, id) =>
    {

        e.preventDefault();
        setbuttonLoading(true);
        setError("");
        try
        {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/delete-category/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth')
                },

            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to delete category');
            console.log(result);
            if (result.success)
            {
                setCategories(categories.filter(cat => cat._id !== id));
            }

        } catch (err)
        {
            setError(err.message);
        } finally
        {
            setbuttonLoading(false)
            setLoading(false);
        }

    }
    if (loading)
    {
        return (
            <Spinner />
        );
    }

    if (error)
    {
        return (
            <ErrorMSg err={error} />
        );
    }
    if (categories.length === 0)    
    {
        return (
            <div className="bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17] min-h-screen p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">No Categories Found</h1>
                <p className="mb-4">It seems there are no categories available. Please add a category to get started.</p>
                <Link
                    href="/dashboard/Categories/add"
                    className="bg-[#EA7A17] hover:bg-[#E81178] text-white font-bold py-2 px-6 rounded transition-colors inline-block text-center"
                >
                    Add Category
                </Link>
            </div>
        );
    }
    {
        return (
            <div className="bg-[#181818] min-h-screen text-white p-8 bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
                <div className="flex justify-between items-center mb-8">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded bg-[#232323] text-white w-72 focus:outline-none"
                    />
                    <Link
                        href="/dashboard/Categories/add"
                        className="bg-[#EA7A17] hover:bg-[#E81178] text-white font-bold py-2 px-6 rounded transition-colors inline-block text-center"
                    >
                        Add Category
                    </Link>
                </div>
                <div className="overflow-x-auto rounded-lg">
                    <table className="w-full bg-[#232323] rounded-lg">
                        <thead>
                            <tr className="bg-[#1a1a1a]">
                                <th className="py-4 px-6 text-left">Category Name</th>
                                <th className="py-4 px-6 text-center">Products</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.filter(cat => cat.CategoryName.toLowerCase().includes(searchTerm.toLowerCase()))
                                ?.map((cat) => (
                                    <tr key={cat._id} className="border-b border-[#333]">
                                        <td className="py-4 px-6">{cat.CategoryName}</td>
                                        <td className="py-4 px-6 text-center">{cat.productCount}</td>
                                        <td className="py-4 px-6 text-center">
                                            <Link
                                                href={`/dashboard/Categories/${cat._id}`}
                                                className="bg-[#00953A] hover:bg-[#EA7A17] text-white rounded px-3 py-1 mr-2 transition-colors"
                                            >
                                                View
                                            </Link>

                                            {/* <button className="bg-[#E81178] hover:bg-[#00953A] text-white rounded px-3 py-1 mr-2 transition-colors">
                                        Edit
                                    </button> */}
                                            <button disabled={buttonLoading} onClick={(e) => handledelete(e, cat._id)} className="bg-[#EA7A17] hover:bg-[#E81178] text-white rounded px-3 py-1 transition-colors">
                                                {buttonLoading ? "...." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default CategoryPage