"use client";
import { useState, useEffect } from "react";
import { loadBookings } from "@/utils/storage";

export default function MyBookingPage() {
  const [bookings, setBookings] = useState([]);

  // Load bookings from storage on mount
  useEffect(() => {
    const savedBookings = loadBookings();
    setBookings(savedBookings);
  }, []);

  const handleCancel = (id) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)));
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">No bookings found. Start by booking a service!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 text-gray-800">{booking.serviceName}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.duration}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.location}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">${booking.totalCost}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "Cancelled" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-300 text-sm">
                        View Details
                      </button>
                      {booking.status !== "Cancelled" && (
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition duration-300 text-sm"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
