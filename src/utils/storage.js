/**
 * localStorage utility functions for booking persistence
 * Handles saving and loading bookings with error handling
 */

/**
 * Save a booking to localStorage
 * @param {Object} bookingData - The booking data to save
 * @param {string} bookingData.serviceId - Service ID
 * @param {string} bookingData.serviceName - Service name
 * @param {number} bookingData.duration - Duration in hours
 * @param {Object} bookingData.location - Location details
 * @param {number} bookingData.totalCost - Total cost
 * @param {string} bookingData.status - Booking status
 * @returns {Object|null} The saved booking with id and createdAt, or null on failure
 */
export const saveBooking = (bookingData) => {
  try {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return newBooking;
  } catch (error) {
    console.error('Failed to save booking:', error);
    return null;
  }
};

/**
 * Load all bookings from localStorage
 * @returns {Array} Array of booking objects, or empty array if none exist or on failure
 */
export const loadBookings = () => {
  // Check if running in browser environment
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  } catch (error) {
    console.error('Failed to load bookings:', error);
    return [];
  }
};
