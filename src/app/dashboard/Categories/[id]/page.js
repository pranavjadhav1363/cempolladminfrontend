"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";

export default function CategoryViewPage() {
    const { id } = useParams();
    const cookie = useCookies();

    const [category, setCategory] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchDelete, setSearchDelete] = useState("");
    const [searchDeleteResults, setSearchDeleteResults] = useState([]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const token = cookie.get("auth");

                const [categoryRes, productsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/category/${id}`, {
                        headers: { "auth-token": token },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/product/list-products`, {
                        headers: { "auth-token": token },
                    }),
                ]);

                const catData = await categoryRes.json();
                const prodData = await productsRes.json();

                if (catData.success) {
                    setCategory(catData.category);
                    setNewName(catData.category.CategoryName);
                    setNewDesc(catData.category.CategoryDesc || "");
                }
                if (prodData.success) setAllProducts(prodData.products);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [id]);

    const handleEditName = () => setEditMode(true);

    const handleSaveName = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/edit-category-name/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookie.get("auth"),
                },
                body: JSON.stringify({
                    NewCategoryName: newName,
                    NewCategoryDesc: newDesc,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setCategory(data.Category);
                setEditMode(false);
            } else {
                alert(data.message || "Update failed");
            }
        } catch (err) {
            console.error("Error updating name:", err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        const lower = value.toLowerCase();
        const result = allProducts.filter(
            (p) =>
                p?.ProductName?.toLowerCase().includes(lower) &&
                !category?.Products?.some((cp) => cp._id === p._id)
        );
        setSearchResults(result);
    };

    const handleDeleteSearch = (e) => {
        const value = e.target.value;
        setSearchDelete(value);
        const lower = value.toLowerCase();
        const result = category?.Products?.filter(
            (p) => p?.ProductName?.toLowerCase().includes(lower)
        );
        setSearchDeleteResults(result);
    };

    const handleAddProduct = async (product) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/add-products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookie.get("auth"),
                },
                body: JSON.stringify({ products: [product._id] }),
            });
            const data = await res.json();
            if (data.success) {
                setCategory(data.category);
                setSearch("");
                setSearchResults([]);
            }
        } catch (err) {
            console.error("Add product error:", err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/category/remove-products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookie.get("auth"),
                },
                body: JSON.stringify({ products: [productId] }),
            });

            const data = await res.json();
            if (data.success) {
                setCategory(data.category);
                setSearchDelete("");
                setSearchDeleteResults([]);
            }
        } catch (err) {
            console.error("Delete product error:", err);
        }
    };

    if (!category) return <div className="text-white p-6">Loading category...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="w-full max-w-2xl p-8 rounded-xl shadow-lg bg-[#232326] text-white">
                <div className="flex justify-center mb-8 text-3xl font-bold space-x-2">
                    <span>CATEGORY</span>
                </div>

                {/* Edit Name and Description */}
                <div className="mb-6 flex flex-col items-center justify-center">
                    {editMode ? (
                        <>
                            <input
                                className="border px-2 py-1 rounded mb-2 w-full bg-[#18181b] text-white border-[#EA7A17]"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Edit category name"
                            />
                            <textarea
                                className="border px-2 py-1 rounded mb-2 w-full bg-[#18181b] text-white border-[#EA7A17]"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                placeholder="Edit category description"
                                rows={3}
                            />
                            <div className="flex space-x-2">
                                <button className="bg-[#00953A] px-3 py-1 rounded" onClick={handleSaveName}>
                                    Save
                                </button>
                                <button
                                    className="bg-gray-600 px-3 py-1 rounded"
                                    onClick={() => {
                                        setEditMode(false);
                                        setNewName(category.CategoryName);
                                        setNewDesc(category.CategoryDesc || "");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-2">{category.CategoryName}</h1>
                            <p className="text-gray-300 mb-4">{category.CategoryDesc}</p>
                            <button className="bg-[#EA7A17] px-3 py-1 rounded" onClick={handleEditName}>
                                Edit Name & Desc
                            </button>
                        </div>
                    )}
                </div>

                {/* Add Product */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Add Product</label>
                    <input
                        className="border px-2 py-1 rounded w-full bg-[#18181b] text-white border-[#E81178]"
                        placeholder="Search products to add..."
                        value={search}
                        onChange={handleSearch}
                    />
                    {search.trim() !== "" && searchResults.length > 0 && (
                        <ul className="border rounded mt-2 bg-[#232326] max-h-40 overflow-y-auto border-[#E81178]">
                            {searchResults.map((product) => (
                                <li
                                    key={product._id || product.ProductName}
                                    className="flex justify-between items-center px-3 py-2 hover:bg-[#18181b]"
                                >
                                    <span>{product.ProductName}</span>
                                    <button
                                        className="bg-[#00953A] text-white px-2 py-1 rounded text-sm"
                                        onClick={() => handleAddProduct(product)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Delete Product */}
                <div className="mb-4 mt-6">
                    <label className="block font-semibold mb-2">Delete Product</label>
                    <input
                        className="border px-2 py-1 rounded w-full bg-[#18181b] text-white border-[#00953A]"
                        placeholder="Search products to delete..."
                        value={searchDelete}
                        onChange={handleDeleteSearch}
                    />
                    {searchDelete.trim() !== "" && searchDeleteResults.length > 0 && (
                        <ul className="border rounded mt-2 bg-[#232326] max-h-40 overflow-y-auto border-[#00953A]">
                            {searchDeleteResults.map((product) => (
                                <li
                                    key={product._id || product.ProductName}
                                    className="flex justify-between items-center px-3 py-2 hover:bg-[#18181b]"
                                >
                                    <span>{product.ProductName}</span>
                                    <button
                                        className="bg-[#E81178] text-white px-2 py-1 rounded text-sm"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Products in Category */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Products in Category</h2>
                    {category.Products.length === 0 ? (
                        <p className="text-gray-400">No products in this category.</p>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {category.Products.map((product) => (
                                <li key={product._id || product.ProductName} className="flex justify-between items-center py-2">
                                    <span>{product.ProductName}</span>
                                    <button
                                        className="bg-[#E81178] text-white px-2 py-1 rounded text-sm"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
