"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { servicesData } from "@/utils/data";
import { saveBooking } from "@/utils/storage";

export default function BookingPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const service = servicesData.find((s) => s.id === params.service_id);

  // Handle service not found
  if (!service) {
    return notFound();
  }

  // Auth Check - Redirect to Login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login");
    }
  }, [status, router]);

  // State for form fields
  const [duration, setDuration] = useState(1);
  const [location, setLocation] = useState({
    division: "",
    district: "",
    city: "",
    area: "", // Address input
  });

  // Dynamic Cost Calculation
  const totalCost = service ? duration * service.chargePerHour : 0;

  const handleBooking = async () => {
    // 4. Confirm Booking → Booking saved with status = Pending
    const bookingData = {
      serviceId: service.id,
      serviceName: service.name,
      duration,
      location,
      totalCost,
      status: "Pending", // Default status
    };

    // Save booking to localStorage
    const savedBooking = saveBooking(bookingData);
    if (!savedBooking) {
      alert("Warning: Booking may not be saved locally");
    }

    // Send email invoice
    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: session.user.email,
          serviceName: service.name,
          totalCost,
          duration,
          location,
        }),
      });

      if (response.ok) {
        console.log('Invoice email sent successfully');
      } else {
        console.error('Failed to send invoice email');
      }
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }

    alert("Booking Confirmed!");
    router.push("/my-bookings");
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-form">
      <h1>Book {service.name}</h1>
      {/* 1. Select Duration */}
      <label>Duration (Hours)</label>
      <input
        type="number"
        min="1"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      {/* 2. Select Location */}
      <div className="location-inputs">
        <input
          placeholder="Division"
          onChange={(e) => setLocation({ ...location, division: e.target.value })}
        />
        <input
          placeholder="District"
          onChange={(e) => setLocation({ ...location, district: e.target.value })}
        />
        <input
          placeholder="City"
          onChange={(e) => setLocation({ ...location, city: e.target.value })}
        />
        <input
          placeholder="Area / Address"
          onChange={(e) => setLocation({ ...location, area: e.target.value })}
        />
      </div>
      {/* 3. Show Total Cost dynamically */}
      <div className="cost-summary">
        <h3>Total Cost: ${totalCost}</h3>
      </div>
      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}
