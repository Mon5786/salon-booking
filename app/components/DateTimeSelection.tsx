"use client";

import { useState } from "react";

type DateTimeSelectionProps = {
  onBack: () => void;
  onContinue: () => void;
};

const availableDates = [
  { id: 1, day: "Mon", date: "14 Sep" },
  { id: 2, day: "Tue", date: "15 Sep" },
  { id: 3, day: "Wed", date: "16 Sep" },
  { id: 4, day: "Thu", date: "17 Sep" },
];

const availableTimes = ["09:00", "10:30", "12:00", "14:00", "15:30"];


export default function DateTimeSelection({
  onBack,
  onContinue,
}: DateTimeSelectionProps) {
const [selectedDate, setSelectedDate] = useState<number | null>(null);
const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`rounded-xl border px-4 py-3 transition ${
                selectedTime === time
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-900"
              }`}
            >
              {time}
            </button>
          ))}
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