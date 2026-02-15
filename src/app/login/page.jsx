"use client";

export default function LoginPage() {
  const handleLogin = (e) => {
    e.preventDefault();
    // Login logic...
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {/* User Authentication: Google Social Login */}
      <button>Continue with Google</button>
    </div>
  );
}
