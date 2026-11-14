"use client";

import { useEffect, useState } from "react";
import { availableDates } from "../data/bookingData";
import type { StaffMember } from "./StaffSelection";

type DateTimeSelectionProps = {
  selectedStaff: number | "anyone" | null;
  selectedDate: number | null;
  setSelectedDate: (value: number | null) => void;
  selectedTime: string | null;
  setSelectedTime: (value: string | null) => void;
  staff: StaffMember[];
  selectedService: number;
  onBack: () => void;
  onContinue: () => void;
};

type BookedSlot = {
  staff_id: number | null;
  booking_date: string;
  booking_time: string;
};


const availableTimes = ["09:00", "10:30", "12:00", "14:00", "15:30"];


export default function DateTimeSelection({
  selectedStaff,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  staff,
  selectedService,
  onBack,
  onContinue,
}: DateTimeSelectionProps) {

  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);


  useEffect(() => {
  async function loadBookings() {
    try {
      const response = await fetch("/api/availability");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load bookings");
      }

      if (!Array.isArray(data)) {
        throw new Error("Availability API did not return an array");
      }

      setBookedSlots(data);
      console.log("Booked slots:", data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  }

  loadBookings();
}, []);

const selectedDateData = availableDates.find(
  (item) => item.id === selectedDate
);

function isTimeBooked(time: string) {
  if (!selectedDateData || selectedStaff === null) {
    return false;
  }

  const now = new Date();

if (selectedDateData.value ===
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`) {
  const [hours, minutes] = time.split(":").map(Number);

  if (hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes()) {
    return true;
  }
}

if (selectedStaff === "anyone") {
  const eligibleStaff = staff.filter((person) =>
    person.serviceIds.includes(selectedService)
  );

  if (eligibleStaff.length === 0) {
    return true;
  }

  const allBooked = eligibleStaff.every((person) =>
    bookedSlots.some(
      (slot) =>
        slot.staff_id === person.id &&
        slot.booking_date === selectedDateData.value &&
        slot.booking_time.startsWith(time)
    )
  );

  return allBooked;
}

  return bookedSlots.some(
    (slot) =>
      slot.staff_id === selectedStaff &&
      slot.booking_date === selectedDateData.value &&
      slot.booking_time.startsWith(time)
  );
}


  return (
  <div>
    <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
      Booking
    </p>

    <h1 className="text-4xl font-semibold text-stone-900">
      Choose a date and time
    </h1>

    <p className="mt-3 text-stone-600">
      Select an available appointment.
    </p>

    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {availableDates.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setSelectedDate(item.id);
            setSelectedTime(null);
          }}
          className={`rounded-2xl border p-4 text-center transition ${
            selectedDate === item.id
              ? "border-stone-900 bg-stone-900 text-white"
              : "border-stone-200 bg-white text-stone-900"
          }`}
        >
          <p
            className={`text-sm ${
              selectedDate === item.id
                ? "text-stone-300"
                : "text-stone-500"
            }`}
          >
            {item.day}
          </p>

          <p className="mt-1 font-semibold">{item.date}</p>
        </button>
      ))}
    </div>

    {selectedDate && (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Available times
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {availableTimes.map((time) => {
            const booked = isTimeBooked(time);
            return (
              <button
                key={time}
                disabled={booked}
                onClick={() => setSelectedTime(time)}
                className={`rounded-xl border px-4 py-3 transition ${
                  booked
                    ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                    : selectedTime === time
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-900"
          }`}
      >
          {time}
      </button>
    );
  })}
        </div>
      </div>
    )}

    {selectedDate && selectedTime && (
      <button
        onClick={onContinue}
        className="mt-8 w-full rounded-xl bg-stone-900 px-6 py-4 font-medium text-white"
      >
        Continue
      </button>
    )}

    <button
      onClick={onBack}
      className="mt-4 w-full rounded-xl border border-stone-300 px-6 py-4 font-medium text-stone-900"
    >
      ← Back
    </button>
  </div>
);
}