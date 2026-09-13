"use client";
import Image from "next/image";
import { useState } from "react";
import StaffSelection from "./components/StaffSelection";

const services = [
  {
    id: 1,
    name: "Haircut",
    duration: 60,
    price: 550,
  },
  {
    id: 2,
    name: "Hair Color",
    duration: 120,
    price: 1200,
  },
  {
    id: 3,
    name: "Balayage",
    duration: 180,
    price: 1800,
  },
];

const staff = [
  {
    id: 1,
    name: "Anna",
    serviceIds: [1, 2, 3],
  },
  {
    id: 2,
    name: "Sara",
    serviceIds: [1, 2],
  },
  {
    id: 3,
    name: "Emma",
    serviceIds: [1, 3],
  },
];

export default function Home() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] =
  useState<number | "anyone" | null>(null);

  const [step, setStep] = useState(1);

  const selectedServiceData = services.find(
  (service) => service.id === selectedService
  );

  return (
  <main className="min-h-screen bg-stone-50 px-6 py-12">
    <div className="mx-auto max-w-3xl">
      {step === 1 && (
        <>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
            Booking
          </p>

          <h1 className="text-4xl font-semibold text-stone-900">
            Choose a service
          </h1>

          <p className="mt-3 text-stone-600">
            Select the treatment you would like to book.
          </p>

          <div className="mt-8 grid gap-4">
            {services.map((service) => {
              const isSelected = selectedService === service.id;

              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-900 hover:border-stone-400"
                  }`}
                >
                  <div>
                    <h2 className="text-lg font-semibold">{service.name}</h2>

                    <p
                      className={`mt-1 text-sm ${
                        isSelected ? "text-stone-300" : "text-stone-500"
                      }`}
                    >
                      {service.duration} minutes
                    </p>
                  </div>

                  <p className="font-medium">{service.price} SEK</p>
                </button>
              );
            })}
          </div>

          {selectedService && (
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full rounded-xl bg-stone-900 px-6 py-4 font-medium text-white"
            >
              Continue
            </button>
          )}
        </>
      )}

      {step === 2 && selectedService && (
        <StaffSelection
          staff={staff}
          selectedService={selectedService}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  </main>
);
}