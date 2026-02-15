import Link from "next/link";
import { servicesData } from "@/utils/data";

// Challenge: Implement Metadata on Home page
export const metadata = {
  title: "Care.xyz - Baby Sitting & Elderly Care",
  description:
    "Reliable and trusted care services for children, elderly, and other family members.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      {/* 1. Banner / Slider with caregiving Motivation */}
      <section className="banner bg-blue-500 p-12 text-center rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Caregiving made easy, secure, and accessible for everyone.
        </h1>
      </section>

      {/* About section explaining platform mission */}
      <section className="about mb-12">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-600">
          happycare.com is a web application that helps users book reliable and trusted
          care services for children, the elderly, or sick individuals.
        </p>
      </section>

      {/* Services overview */}
      <section className="services">
        <h2 className="text-2xl font-semibold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="border p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-500 mb-4">{service.description}</p>
              <Link
                href={`/service/${service.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials / Success metrics */}
      <section className="testimonials mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Success Metrics</h2>
        <div className="flex justify-center gap-12">
          <div>
            <p className="text-3xl font-bold">500+</p>
            <p>Caregivers</p>
          </div>
          <div>
            <p className="text-3xl font-bold">1k+</p>
            <p>Happy Families</p>
          </div>
        </div>
      </section>
    </main>
  );
}
