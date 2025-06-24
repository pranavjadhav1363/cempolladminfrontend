'use client';
import React, { useContext, useEffect, useState } from 'react';
import CloudinaryUploader from '../_Dashboard_components/CloudinaryUploader';
import AppContext from '@/app/context/AppContext';
import Frommessage from '../_Dashboard_components/frommessage';
import Spinner from '../_Dashboard_components/spinner';
import { CldUploadButton } from 'next-cloudinary';
import { useCookies } from 'next-client-cookies';
const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

const hardcodedImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    { id: 2, url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: 3, url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
    { id: 4, url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' },
];

export default function GalleryPage()
{
    const cookie = useCookies();
    const context = useContext(AppContext);
    const { uploadedImages, fetchGalleryImages } = context;
    console.log(uploadedImages);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [buttonLoading, setbuttonLoading] = useState(false);
    console.log("uploadedImages", images);
     const handleUploadImages = async (imageUrls) =>
    {
        if (!imageUrls || imageUrls.length === 0)
        {
            setError('No images to upload');
            return;
        }

        try
        {
            setUploading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/gallery/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth') // Assuming you have authToken in context
                },
                body: JSON.stringify({ Images: imageUrls }),
            });
            const data = await response.json();

            if (response.ok && data.success)
            {
                setImages((prevImages) => [...prevImages, ...imageUrls]); 
            } else
            {
                setError(data.error || 'Failed to upload images');
            }
        } catch (err)
        {
            console.error(err);
            setError('Internal Server Error');
        } finally
        {
            setUploading(false);
        }
    };
  const handleDelete = async (imageUrl) => {
    try {
        setbuttonLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/gallery/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth'),

                },
            body: JSON.stringify({ Images: [imageUrl] })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Update the state with the updated gallery
            setImages(data.gallery);
        } else {
            console.error(data.message || "Failed to delete image.");
        }
    } catch (error) {
        console.error("Internal server error:", error);
    }finally
    {
        setbuttonLoading(false);
    }
};
    useEffect(() =>
    {
        const fetchGalleryImages = async () =>
        {
            try
            {
                const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/gallery/get-gallery`);
                const data = await response.json();
                console.log("data", data);
                if (data.success)
                {
                    setImages(data.galleries);

                } else
                {
                    return data.message || "Failed to fetch gallery images";
                }
            } catch (error)
            {
                return data.message || "Internal Server Error";
            }
        };
        fetchGalleryImages();
    }, [handleUploadImages, handleDelete]);
   
   

    const handleFileChange = (e) =>
    {
        setFile(e.target.files[0]);
    };

    const handleUpload = () =>
    {
        if (!file) return;
        setUploading(true);
        // Simulate upload and add a new image with a random id and a placeholder URL
        setTimeout(() =>
        {
            setImages([
                ...images,
                {
                    id: Date.now(),
                    url: URL.createObjectURL(file),
                },
            ]);
            setFile(null);
            setUploading(false);
        }, 1000);
    };
    if (loading)
    {
        return <Spinner />
    }
      if (images?.length === 0)    
    {
        return (
            <div className="bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17] min-h-screen p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">No Images Found</h1>
                <p className="mb-4">It seems there are no Images available. Please add a Image to get started.</p>
                
                   <CldUploadButton
                        options={{ multiple: true }}
                        onSuccess={async (result) =>
                        {
                            await handleUploadImages([result?.info?.secure_url]);

                        }}
                        style={{
                            backgroundColor: '#EA7A17', // orange
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        uploadPreset={cloudPresetName}
                    >
                        <span>Upload Image</span>
                    </CldUploadButton>
             
            </div>
        );
    }
    return (

        <div className="min-h-screen bg-gray-900 text-white p-8 bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
            <div className="flex justify-between items-center mb-8">



                <h1 className="text-3xl font-bold" style={{ color: '#EA7A17' }}>Gallery</h1>
                <div className="flex items-center gap-2">

                    <CldUploadButton
                        options={{ multiple: true }}
                        onSuccess={async (result) =>
                        {
                            await handleUploadImages([result?.info?.secure_url]);

                        }}
                        style={{
                            backgroundColor: '#EA7A17', // orange
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        uploadPreset={cloudPresetName}
                    >
                        <span>Upload Image</span>
                    </CldUploadButton>
                </div>
            </div>
            {error && (
                <Frommessage msg={error} color={'red'} />
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.isArray(images) && images.length > 0 && images.flatMap((imgDoc) =>
                    Array.isArray(imgDoc.Images) ? imgDoc.Images.map((url, idx) => (
                        <div key={`${imgDoc._id}-${idx}`} className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center">
                            <img
                                src={url}
                                alt="Gallery"
                                className="w-full h-48 object-cover rounded mb-4 border-4"
                                style={{ borderColor: '#EA7A17' }}
                            />
                            <button
                            disabled={buttonLoading}
                                onClick={() => handleDelete(url)}
                                className="bg-[#00953A] hover:bg-[#E81178] text-white px-4 py-2 rounded transition"
                            >
                                {buttonLoading ? "..." : "Delete"}
                            </button>
                        </div>
                    )) : null
                )}
            </div>
        </div>
    );
}
