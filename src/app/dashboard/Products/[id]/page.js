"use client";
import React, { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";



const ProductDetailPage = () =>
{
    const cookie = useCookies();
    const { id } = useParams();
    console.log("Product ID:", id); // For debugging purposes
    const [editing, setEditing] = useState(false);
    const [product, setProduct] = useState(null);
    const [form, setForm] = useState(product);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() =>
    {
        const fetchProduct = async () =>
        {
            try
            {

                setLoading(true);
                setError("");

                const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/product/get-product/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': cookie.get('auth'),
                    },
                });
                const data = await res.json();
                if (data.success && data.product)
                {
                    setProduct(data.product);
                    setForm(data.product);

                }
            } catch (err)
            {
                setError("Failed to fetch product.");
                console.error("Failed to fetch product:", err);
            } finally
            {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
        // eslint-disable-next-line
    }, [id]);
    const handleEdit = () =>
    {
        setForm(product);
        setEditing(true);
    };

    const handleCancel = () =>
    {
        setEditing(false);
    };

    const handleChange = (e) =>
    {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFeatureChange = (idx, field, value) =>
    {
        const updated = form.FeaturesAndBenefits.map((f, i) =>
            i === idx ? { ...f, [field]: value } : f
        );
        setForm({ ...form, FeaturesAndBenefits: updated });
    };

    const handleAddFeature = () =>
    {
        setForm({
            ...form,
            FeaturesAndBenefits: [
                ...form.FeaturesAndBenefits,
                { FeatureName: "", Description: "" }
            ]
        });
    };

    const handleRemoveFeature = (idx) =>
    {
        setForm({
            ...form,
            FeaturesAndBenefits: form.FeaturesAndBenefits.filter((_, i) => i !== idx)
        });
    };

    const handleSave = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        try
        {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/product/edit-product/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": cookie.get("auth"),
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok || !data.success)
            {
                throw new Error(data.message || "Failed to save product");
            }

            setProduct(form);  // Update local state
            setEditing(false);
        } catch (err)
        {
            console.error("Error saving product:", err.message);
            setError(err.message || "Something went wrong.");
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="w-full max-w-2xl rounded-xl shadow-lg  p-8 border border-[#2d2d36]">
                <h1 className="text-3xl font-bold mb-6  text-center text-[#EA7A17]">Product Details</h1>
                {!editing ? (
                    <div>
                        <div className="mb-4">
                            <span className="text-[#E81178] font-semibold">Name:</span>
                            <span className="ml-2 text-gray-200">{product?.ProductName}</span>
                        </div>
                        <div className="mb-4">
                            <span className="text-[#E81178] font-semibold">Description:</span>
                            <span className="ml-2 text-gray-300">{product?.ProductDescription}</span>
                        </div>
                        <div className="mb-4">
                            <span className="text-[#E81178] font-semibold">TDS:</span>
                            {product?.ProductTDS && (
                                <Link
                                    href={product.ProductTDS}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-[#00953A] font-bold underline hover:text-green-500"
                                >
                                    View PDF
                                </Link>
                            )}
                        </div>
                        <div className="mb-4">
                            <span className="text-[#E81178] font-semibold">Images:</span>
                            <div className="flex gap-2 mt-2">
                                {product?.ProductImage.map((img, i) => (
                                   <Image
                                                key={i}
                                                src={img}
                                                alt={"PRODUCT"}
                                                width={"150"}
                                                height={"100"}
                                                className="object-cover"
                                              />
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <span className="text-[#E81178] font-semibold">Features & Benefits:</span>
                            <ul className="ml-4 mt-2 space-y-2">
                                {product?.FeaturesAndBenefits.map((f, i) => (
                                    <li key={i} className="text-gray-200">
                                        <span className="text-[#EA7A17]">{f.FeatureName}:</span> {f.Description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="px-6 py-2 rounded-lg bg-[#EA7A17] text-white font-semibold hover:bg-[#e85c00] transition"
                        >
                            Edit Details
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-[#E81178] font-semibold mb-1">Name</label>
                            <input
                                name="ProductName"
                                value={form.ProductName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded bg-[#18181b] text-gray-100 border border-[#EA7A17] focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#E81178] font-semibold mb-1">Description</label>
                            <textarea
                                name="ProductDescription"
                                value={form?.ProductDescription}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded bg-[#18181b] text-gray-100 border border-[#E81178] focus:outline-none focus:ring-2 focus:ring-[#E81178]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#E81178] font-semibold mb-1">TDS (PDF)</label>
                            {form?.ProductTDS && (
                                <Link
                                    href={form.ProductTDS}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#00953A] underline hover:text-green-500 block mb-2"
                                >
                                    View Current TDS
                                </Link>
                            )}
                            <CldUploadButton
                                options={{ multiple: false, resource_type: "raw" }}
                                onSuccess={(result) =>
                                {
                                    setForm({ ...form, ProductTDS: result.info.secure_url });
                                }}
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
                                style={{
                                    backgroundColor: "#EA7A17",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                <span>Upload TDS</span>
                            </CldUploadButton>
                        </div>
                        <div>
                            <label className="block text-[#E81178] font-semibold mb-1">Images</label>
                            <div className="flex gap-2 flex-wrap mb-3">
                                {form?.ProductImage.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <Image
                                                key={idx}
                                                src={img}
                                                alt={"PRODUCT"}
                                                width={"150"}
                                                height={"100"}
                                                className="object-cover"
                                              />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    ProductImage: prev.ProductImage.filter((_, i) => i !== idx),
                                                }))
                                            }
                                            className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <CldUploadButton
                                options={{ multiple: true }}
                                onSuccess={(result) =>
                                {
                                    setForm((prevForm) => ({
                                        ...prevForm,
                                        ProductImage: [...prevForm.ProductImage, result.info.secure_url],
                                    }));
                                }}
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
                                style={{
                                    backgroundColor: "#EA7A17",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                <span>Upload Images</span>
                            </CldUploadButton>
                        </div>
                        <div>
                            <label className="block text-[#E81178] font-semibold mb-2">Features & Benefits</label>
                            <div className="space-y-4">
                                {form.FeaturesAndBenefits.map((f, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Feature Name"
                                            value={f.FeatureName}
                                            onChange={e =>
                                                handleFeatureChange(idx, "FeatureName", e.target.value)
                                            }
                                            className="flex-1 px-2 py-1 rounded bg-[#18181b] text-gray-100 border border-[#EA7A17] focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={f.Description}
                                            onChange={e =>
                                                handleFeatureChange(idx, "Description", e.target.value)
                                            }
                                            className="flex-1 px-2 py-1 rounded bg-[#18181b] text-gray-100 border border-[#E81178] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(idx)}
                                            className="px-2 py-1 rounded bg-[#E81178] text-white hover:bg-[#b80a5c]"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="px-4 py-1 rounded bg-[#00953A] text-white hover:bg-[#007a2e] mt-2"
                                >
                                    Add Feature
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg bg-[#00953A] text-white font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#007a2e]"
                                    }`}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 rounded-lg bg-[#E81178] text-white font-semibold hover:bg-[#b80a5c] transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
