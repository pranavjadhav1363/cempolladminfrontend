'use client';
import { useCookies } from 'next-client-cookies';
import { CldUploadButton } from 'next-cloudinary';
import { useState } from 'react';
import Frommessage from '../../_Dashboard_components/frommessage';


export default function AddClientPage() {
        const cookie = useCookies();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setButtonLoading(true);
        setError('');
        setSuccess(false);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/client/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookie.get('auth'),

                },
                body: JSON.stringify({ name, image }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to add client');
            }
            setSuccess(true);
            setName('');
            setImage('');
        } catch (err) {
            setError(err.message);
        } finally {
            setButtonLoading(false);
        }
    }
    
    return (
        <div className="bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17] min-h-screen flex items-center justify-center bg-[#18181b]">
            <form
                className="bg-[#232326] p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6"
                style={{
                    border: '2px solid #EA7A17',
                }}
            >
                <h2 className="text-2xl font-bold text-[#EA7A17] mb-2 text-center">
                    Add New Client
                </h2>
                {error && (
                    <Frommessage msg={error} color={"red"} />
                )}
                {success && (
                    <Frommessage msg={"Client Added Succesfully"} color={"green"} />
                )}
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[#E81178] font-semibold">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="px-4 py-2 rounded bg-[#18181b] text-white border border-[#00953A] focus:outline-none focus:ring-2 focus:ring-[#EA7A17] transition"
                        placeholder="Enter client name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="image" className="text-[#00953A] font-semibold">
                        Upload Image
                    </label>
                     <CldUploadButton
                        options={{ multiple: false }}
                        onSuccess={async (result) =>
                        {
                            setImage(result?.info?.secure_url);

                        }}
                        style={{
                            backgroundColor: '#EA7A17', // orange
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
                    >
                        <span>Upload Image</span>
                    </CldUploadButton>
                    {image && (
                        <img
                            src={image}
                            alt="Preview"
                            className="mt-2 rounded shadow max-h-40 object-contain border border-[#EA7A17]"
                        />
                    )}
                </div>
                <button
                 disabled={buttonLoading}
                onClick={handleSubmit}
                    type="submit"
                    className="mt-4 bg-gradient-to-r from-[#EA7A17] via-[#E81178] to-[#00953A] text-white font-bold py-2 rounded shadow hover:opacity-90 transition"
                >
                      {buttonLoading ? "..." : "Submit"}
                </button>
            </form>
        </div>
    );
}