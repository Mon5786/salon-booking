
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
  service_id: number;
  booking_date: string;
  booking_time: string;
};

const serviceDurations: Record<number, number> = {
  1: 60,   // Haircut
  2: 120,  // Hair Color
  3: 180,  // Balayage
};

const availableTimes = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "15:30",
];

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasOverlap(
  requestedTime: string,
  requestedService: number,
  bookedTime: string,
  bookedService: number
) {
  const requestedStart = toMinutes(requestedTime);
  const requestedDuration = serviceDurations[requestedService];
  const bookedDuration = serviceDurations[bookedService];

  if (!requestedDuration || !bookedDuration) {
    return true;
  }

  const requestedEnd = requestedStart + requestedDuration;
  const bookedStart = toMinutes(bookedTime);
  const bookedEnd = bookedStart + bookedDuration;

  return requestedStart < bookedEnd && bookedStart < requestedEnd;
}

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

  const [availabilityStatus, setAvailabilityStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        const response = await fetch("/api/availability", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load bookings");
        }

        const data: unknown = await response.json();

        if (
          !Array.isArray(data) ||
          !data.every(
            (slot) =>
              slot !== null &&
              typeof slot === "object" &&
              (typeof slot.staff_id === "number" ||
                slot.staff_id === null) &&
              typeof slot.service_id === "number" &&
              typeof slot.booking_date === "string" &&
              typeof slot.booking_time === "string"
          )
        ) {
          throw new Error("Invalid availability data");
        }

        if (active) {
          setBookedSlots(data as BookedSlot[]);
          setAvailabilityStatus("ready");
        }
      } catch (error) {
        console.error("Error loading bookings:", error);

        if (active) {
          setAvailabilityStatus("error");
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const selectedDateData = availableDates.find(
    (item) => item.id === selectedDate
  );

  function isTimeBooked(time: string) {
    if (availabilityStatus !== "ready") {
      return true;
    }

    if (!selectedDateData || selectedStaff === null) {
      return true;
    }

    if (!serviceDurations[selectedService]) {
      return true;
    }

    const now = new Date();

    const today = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    if (selectedDateData.value < today) {
      return true;
    }

    if (selectedDateData.value === today) {
      if (
        toMinutes(time) <=
        now.getHours() * 60 + now.getMinutes()
      ) {
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
            hasOverlap(
              time,
              selectedService,
              slot.booking_time,
              slot.service_id
            )
        )
      );

      return allBooked;
    }

    const selectedPerson = staff.find(
      (person) => person.id === selectedStaff
    );

    if (
      !selectedPerson ||
      !selectedPerson.serviceIds.includes(selectedService)
    ) {
      return true;
    }

    return bookedSlots.some(
      (slot) =>
        slot.staff_id === selectedStaff &&
        slot.booking_date === selectedDateData.value &&
        hasOverlap(
          time,
          selectedService,
          slot.booking_time,
          slot.service_id
        )
    );
  }

  const canContinue =
    selectedDate !== null &&
    selectedTime !== null &&
    !isTimeBooked(selectedTime);

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

      {availabilityStatus === "loading" && (
        <p className="mt-3 text-stone-500">
          Checking availability...
        </p>
      )}

      {availabilityStatus === "error" && (
        <p className="mt-3 text-red-600">
          Unable to load available times. Please refresh the page.
        </p>
      )}

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

            <p className="mt-1 font-semibold">
              {item.date}
            </p>
          </button>
        ))}
      </div>

      {selectedDate !== null && (
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

      {canContinue && (
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
