import Link from "next/link";
import { servicesData } from "@/utils/data";
import { notFound } from "next/navigation";

// Generate static params for all service IDs
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    service_id: service.id,
  }));
}

// Challenge: Implement Metadata on Service details page
export async function generateMetadata({ params }) {
  const service = servicesData.find((s) => s.id === params.service_id);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.name} - Care.xyz`,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }) {
  const { service_id } = params;
  const service = servicesData.find((s) => s.id === service_id);

  // 9. Error Page (404) if service is not found
  if (!service) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {/* Service Detail Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.name}</h1>

        <div className="prose lg:prose-xl text-gray-600 mb-8">
          <p>{service.description}</p>
          <p className="font-semibold text-blue-600">
            Rate: ${service.chargePerHour} per hour
          </p>
        </div>

        {/* Book Service button navigates to Booking Page / Login */}
        <Link href={`/booking/${service.id}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
            Book Service
          </button>
        </Link>

        <div className="mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
