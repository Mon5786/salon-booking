"use client";

import { useState } from "react";

type CustomerDetailsProps = {
  onBack: () => void;
  onContinue: () => void;
};

export default function CustomerDetails({
  onBack,
  onContinue,
}: CustomerDetailsProps) {
const [name, setName] = useState("");
const [contact, setContact] = useState("");

  return (
    <div>
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
        Booking
      </p>

      <h1 className="text-4xl font-semibold text-stone-900">
        Your details
      </h1>

      <p className="mt-3 text-stone-600">
        Enter your contact information.
      </p>

      <div className="mt-8 space-y-4">
        <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-stone-900"
        />

        <input
            type="text"
            placeholder="Phone or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-stone-900"
        />

        {name && contact && (
            <button
                onClick={onContinue}
                className="mt-6 w-full rounded-xl bg-stone-900 px-6 py-4 font-medium text-white"
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
    </div>
  );
}