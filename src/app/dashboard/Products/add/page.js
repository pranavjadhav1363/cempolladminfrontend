"use client";
import { useCookies } from "next-client-cookies";
import { CldUploadButton } from "next-cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function AddProductPage()
{
    const cookie = useCookies();
    const [tdsPreview, setTdsPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [form, setForm] = useState({
        ProductName: "",
        ProductDescription: "",
        ProductTDS: "",
        ProductImage: [], // store array of image URLs
        FeaturesAndBenefits: [{ FeatureName: "", Description: "" }],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) =>
    {
        const { name, value, files } = e.target;
        if ((name === "ProductTDS" || name === "ProductImage") && files?.[0])
        {
            const file = files[0];
            setForm({ ...form, [name]: file });

            const previewUrl = URL.createObjectURL(file);
            if (name === "ProductTDS")
            {
                setTdsPreview(previewUrl);
            } else if (name === "ProductImage")
            {
                setImagePreview(previewUrl);
            }
        } else
        {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFeatureChange = (idx, e) =>
    {
        const { name, value } = e.target;
        const features = [...form.FeaturesAndBenefits];
        features[idx][name] = value;
        setForm({ ...form, FeaturesAndBenefits: features });
    };

    const addFeature = () =>
    {
        setForm({
            ...form,
            FeaturesAndBenefits: [
                ...form.FeaturesAndBenefits,
                { FeatureName: "", Description: "" },
            ],
        });
    };

    const removeFeature = (idx) =>
    {
        const features = form.FeaturesAndBenefits.filter((_, i) => i !== idx);
        setForm({ ...form, FeaturesAndBenefits: features });
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const data = {
            ProductName: form.ProductName,
            ProductDescription: form.ProductDescription,
            ProductTDS: form.ProductTDS,
            ProductImage: form.ProductImage,
            FeaturesAndBenefits: form.FeaturesAndBenefits,
        };

        try
        {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/product/create-product`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth'),

                },
                body: JSON.stringify(data),
            });
            if (res.ok)
            {
                setMessage("Product added successfully!");
                setForm({
                    ProductName: "",
                    ProductDescription: "",
                    ProductTDS: null,
                    ProductImage: null,
                    FeaturesAndBenefits: [{ FeatureName: "", Description: "" }],
                });
            } else
            {
                setMessage("Failed to add product.");
            }
        } catch
        {
            setMessage("Error occurred.");
        }
        setLoading(false);
    };
    useEffect(() =>
    {
        return () =>
        {
            if (tdsPreview) URL.revokeObjectURL(tdsPreview);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [tdsPreview, imagePreview]);
    return (
        <div className="bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className=" max-w-2xl mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-br from-[#EA7A17]/10 via-[#00953A]/10 to-[#E81178]/10">
                <h1 className="text-3xl font-bold mb-6 text-[#EA7A17]">Add Product</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {message && (
                        <div className="text-center mt-2 text-[#EA7A17] font-semibold">
                            {message}
                        </div>
                    )}
                       <div>
                        <label className="block font-semibold text-[#00953A] mb-1">
                            Product TDS (PDF/Image)
                        </label>

                        <CldUploadButton
                            options={{ multiple: false }}
                            onSuccess={async (result) =>
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

                        {form.ProductTDS && (
                            <div className="mt-2 flex items-center gap-2">
                                <Link
                                    href={form.ProductTDS}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    View TDS
                                </Link>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({ ...prev, ProductTDS: "" }))
                                    }
                                    className="text-red-600 text-sm font-bold px-2 rounded-full hover:bg-red-100"
                                    title="Remove TDS"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold text-[#00953A] mb-1">
                            Product Images
                        </label>
                        <CldUploadButton
                            options={{ multiple: true }}
                            onSuccess={async (result) =>
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

                        {/* Preview all images */}
                        <div className="mt-3 flex gap-3 flex-wrap">
                            {form?.ProductImage?.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <Link
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={url}
                                            alt={`Product ${idx + 1}`}
                                            className="h-24 w-24 object-cover rounded border shadow"
                                        />
                                    </Link>

                                    {/* ❌ Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                ProductImage: prevForm.ProductImage.filter((_, i) => i !== idx),
                                            }))
                                        }
                                        className="absolute top-0 right-0 bg-white text-red-600 text-sm font-bold px-1 rounded-full shadow hover:bg-red-100"
                                        title="Remove Image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  
                    <div>
                        <label className="block font-semibold text-[#00953A] mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="ProductName"
                            value={form.ProductName}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#00953A] text-black bg-gray-50 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-[#00953A] mb-1">
                            Product Description <span className="text-sm text-gray-600">({form.ProductDescription.length}/500)</span>
                        </label>
                        <textarea
                            name="ProductDescription"
                            value={form.ProductDescription}
                            onChange={handleChange}
                            required
                            maxLength={500}
                            className="w-full border border-[#00953A] text-black bg-gray-50 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
                            placeholder="Enter product description (max 500 characters)"
                        />
                    </div>
                   
                    
                    <div>
                        <label className="block font-semibold text-[#00953A] mb-2">
                            Features & Benefits
                        </label>
                        {form?.FeaturesAndBenefits?.map((feature, idx) => (
                            <div
                                key={idx}
                                className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-start bg-white/60 rounded p-3"
                            >
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature Name</label>
                                    <input
                                        type="text"
                                        name="FeatureName"
                                        placeholder="Feature Name"
                                        value={feature.FeatureName}
                                        onChange={(e) => handleFeatureChange(idx, e)}
                                       
                                        className="w-full border border-[#00953A] text-black bg-gray-50 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-xs text-gray-500">({feature.Description.length}/75)</span></label>
                                    <input
                                        type="text"
                                        name="Description"
                                        placeholder="Description"
                                        value={feature.Description}
                                        onChange={(e) => handleFeatureChange(idx, e)}
                                        maxLength={75}
                                     
                                        className="w-full border border-[#00953A] text-black bg-gray-50 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
                                    />
                                </div>
                                <div className="flex items-center h-full mt-5 md:mt-6">
                                    {form.FeaturesAndBenefits.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            className="text-red-600 font-bold text-xl px-2 hover:text-red-800"
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addFeature}
                            className="bg-[#00953A] text-white px-3 py-1 rounded hover:bg-[#EA7A17] transition"
                        >
                            + Add Feature
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#EA7A17] via-[#00953A] to-[#E81178] text-white font-bold py-2 rounded shadow hover:opacity-90 transition"
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </button>

                </form>
            </div>
        </div>
    );
}