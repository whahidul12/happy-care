import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      [cite_start]{/* Show Not Found message [cite: 10] */}
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      [cite_start]{/* Button to return to Home [cite: 10] */}
      <Link href="/">
        <button>Return to Home</button>
      </Link>
    </div>
  );
}
