'use client';
import AppContext from '@/app/context/AppContext';
import { CldUploadButton } from 'next-cloudinary';
import { useContext } from 'react';

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

const CloudinaryUploader = () => {
     const context = useContext(AppContext);
     const {appendToUploadedImages, uploadedImages, fetchGalleryImages} = context;


  return (
    <div>
      <CldUploadButton
        options={{ multiple: true }}
         onSuccess={async (result) => {
            await appendToUploadedImages(result.info.secure_url);
            console.log('Uploaded Images:', uploadedImages);
        
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
};

export default CloudinaryUploader;