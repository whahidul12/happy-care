"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nid: "",
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    /**
     * Password validation regex: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/
     * 
     * Pattern breakdown:
     * - ^                 : Start of string
     * - (?=.*[a-z])       : Positive lookahead - must contain at least one lowercase letter (a-z)
     * - (?=.*[A-Z])       : Positive lookahead - must contain at least one uppercase letter (A-Z)
     * - .{6,}             : Match any character (.) at least 6 times ({6,})
     * - $                 : End of string
     * 
     * Requirements validated:
     * ✓ Minimum 6 characters
     * ✓ At least 1 uppercase letter
     * ✓ At least 1 lowercase letter
     * 
     * Examples:
     * - "Pass12" → Valid (6 chars, has 'P' uppercase, has 'ass' lowercase)
     * - "password" → Invalid (no uppercase)
     * - "PASSWORD" → Invalid (no lowercase)
     * - "Pass1" → Invalid (only 5 characters)
     */
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert("Password must be 6+ chars, with 1 uppercase and 1 lowercase letter.");
      return;
    }

    // Register logic here...
    console.log("User Registered:", formData);

    // Redirect to Booking Page after registration
    // Note: If they came from a specific booking, redirect there. Defaulting to general booking or home.
    router.push("/");
  };

  return (
    <form onSubmit={handleRegister}>
      <input name="nid" placeholder="NID No" required onChange={handleChange} />
      <input name="name" placeholder="Name" required onChange={handleChange} />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        onChange={handleChange}
      />
      <input name="contact" placeholder="Contact" required onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
}
