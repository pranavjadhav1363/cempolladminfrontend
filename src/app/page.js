"use client"
import Image from "next/image";
import { useCookies } from 'next-client-cookies';
import cempoll_logo from "@/app/_utils/cempoll_logo.jpeg";// Adjust the path as necessary
import { useState } from "react";
import { useRouter } from 'next/navigation'
export default function Home() {
  const [EmailId, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useRouter()
   const cookies = useCookies();

  const handleSubmit = async (e) => {

    e.preventDefault();
      
       
    setError(""); // Reset error before submit
    setLoading(true); // Set loading true on submit
    try {
      console.log("Submitting login with Email:", EmailId, "and Password:", Password);
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTES_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ EmailId, Password }),
      });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.message || "Login failed. Please check your credentials.");
      } else {
        setError("");
        cookies.set('auth', data.token)
        cookies.set('role', data.user.Role)
          navigate.replace("/dashboard"); 
          return;

     // Redirect to dashboard on successful login
        
      }
     
      console.log("Login response:", data);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false); // Set loading false after request
    // You can handle login logic here
    console.log("Email:", EmailId);
    console.log("Password:", Password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17]">
      <div className="bg-[#1e1e1e] p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          {/* Logo: horizontal, #EA7A17 (orange), #00953A (green), #E81178 (pink) */}
          <div className="flex items-center space-x-2">
            <Image
              src={cempoll_logo}
              alt="Cempoll Logo"
              width={"auto"}
              height={"auto"}
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign in to your account</h2>
        {error && (
          <div className="mb-4 text-red-500 text-center">{error}</div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-[#232323] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#EA7A17]"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={EmailId}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-[#232323] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#00953A]"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#EA7A17] via-[#00953A] to-[#E81178] text-[#121212] font-semibold hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
