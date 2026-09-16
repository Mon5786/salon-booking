"use client";
import Image from "next/image";
import { useState } from "react";
import StaffSelection from "./components/StaffSelection";
import DateTimeSelection from "./components/DateTimeSelection";
import CustomerDetails from "./components/CustomerDetails";
import PaymentSelection from "./components/PaymentSelection";
import BookingConfirmation from "./components/BookingConfirmation";
import { availableDates } from "./data/bookingData";
import { supabase } from "./lib/supabase";
import BookingSuccess from "./components/BookingSuccess";

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
  const [selectedStaff, setSelectedStaff] = useState<number | "anyone" | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "salon" | null>(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const selectedServiceData = services.find(
  (service) => service.id === selectedService
  );

  const selectedDateData = availableDates.find(
  (item) => item.id === selectedDate
);

  const selectedStaffData =
  selectedStaff === "anyone"
    ? null
    : staff.find((person) => person.id === selectedStaff);

  const [isSaving, setIsSaving] = useState(false);

async function handleConfirmBooking() {
  setIsSaving(true);
    const { error } = await supabase
    .from("bookings")
    .insert({
      service_id: selectedService,
      staff_id: selectedStaff === "anyone" ? null : selectedStaff,
      booking_date: selectedDateData?.value,
      booking_time: selectedTime,
      customer_name: name,
      customer_contact: contact,
      payment_method: paymentMethod,
    });

  if (error) {
  console.error("Booking error message:", error.message);
  console.error("Booking error code:", error.code);
  console.error("Booking error details:", error.details);
  console.error("Booking error hint:", error.hint);
  setIsSaving(false);
  return;
}

  console.log("Booking saved!");
  setStep(7);
}
  
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
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <DateTimeSelection
          selectedStaff={selectedStaff}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onBack={() => setStep(2)}
          onContinue={() => setStep(4)}
      />
    )}

      {step === 4 && (
        <CustomerDetails
          name={name}
          setName={setName}
          contact={contact}
          setContact={setContact}
          onBack={() => setStep(3)}
          onContinue={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <PaymentSelection 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={() => setStep(4)}
          onContinue={() => setStep(6)}
        />
      )}

      {step === 6 && selectedServiceData && paymentMethod && (
        <BookingConfirmation
          serviceName={selectedServiceData.name}
          staffName={
            selectedStaff === "anyone"
            ? "Anyone"
            : selectedStaffData?.name ?? ""
        }
          date={selectedDateData?.date ?? ""}
          time={selectedTime ?? ""}
          customerName={name}
          customerContact={contact}
          paymentMethod={paymentMethod}
          onConfirm={handleConfirmBooking}
          isSaving={isSaving}
        />
      )}

      {step === 7 && (
        <BookingSuccess />
      )}

    </div>
  </main>
);
}