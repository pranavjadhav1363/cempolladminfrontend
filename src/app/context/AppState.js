"use client"
import React, { useState } from 'react'
import AppContext from "./AppContext";





const AppState = (props) => {

    
    const [uploadedImages, setUploadedImages] = useState([]);
    const [GalleryImages, setGalleryImages] = useState([]);

    const appendToUploadedImages = (newImages) => {
        console.log("New Images:", newImages);
        setUploadedImages(prevImages => [
            ...prevImages,
            ...(Array.isArray(newImages) ? newImages : [newImages])
        ]);
    };
    const fetchGalleryImages = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/gallery/get-gallery`);
            const data = await response.json();
            if (data.success) {
                setGalleryImages(data.galleries);
                
            }else{
                return data.message || "Failed to fetch gallery images";
            }
        } catch (error) {
             return data.message || "Internal Server Error";
        }
    };

    const addImagesToGallery = async () => {
        try {
            if (!uploadedImages || !Array.isArray(uploadedImages) || uploadedImages.length === 0) {
                return "No images to upload.";
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/gallery/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Images: uploadedImages })
            });
            const data = await response.json();
            if (data.success) {
                setGalleryImages(data.gallery.Images);
                return "Images added successfully.";
            } else {
                return data.message || "Failed to add images.";
            }
        } catch (error) {
            return "Internal Server Error";
        }
    };

    const removeImagesFromGallery = async (imagesToRemove) => {
        try {
            if (!imagesToRemove || !Array.isArray(imagesToRemove) || imagesToRemove.length === 0) {
                return "No images to remove.";
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/gallery/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Images: imagesToRemove })
            });
            const data = await response.json();
            if (data.success) {
                setGalleryImages(data.gallery.Images);
                return "Images removed successfully.";
            } else {
                return data.message || "Failed to remove images.";
            }
        } catch (error) {
            return "Internal Server Error";
        }
    };
    
    return (<AppContext.Provider value={{ uploadedImages, GalleryImages,appendToUploadedImages,fetchGalleryImages, addImagesToGallery,removeImagesFromGallery }}>
        {props.children}
    </AppContext.Provider>)
}

export default AppState
