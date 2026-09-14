"use client";

type PaymentSelectionProps = {
  paymentMethod: "online" | "salon" | null;
  setPaymentMethod: (value: "online" | "salon") => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function PaymentSelection({
  paymentMethod,
  setPaymentMethod,
  onBack,
  onContinue,
}: PaymentSelectionProps) {

  return (
    <div>
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
        Booking
      </p>

      <h1 className="text-4xl font-semibold text-stone-900">
        Choose payment method
      </h1>

      <p className="mt-3 text-stone-600">
        How would you like to pay?
      </p>

      <div className="mt-8 grid gap-4">
        <button
            onClick={() => setPaymentMethod("online")}
            className={`rounded-2xl border p-5 text-left transition ${
                paymentMethod === "online"
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-900"
            }`}
        >
            <h2 className="text-lg font-semibold">Pay online</h2>
        </button>

        <button
            onClick={() => setPaymentMethod("salon")}
            className={`rounded-2xl border p-5 text-left transition ${
                paymentMethod === "salon"
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-900"
            }`}
        >
            <h2 className="text-lg font-semibold">Pay at salon</h2>
        </button>
        
        {paymentMethod && (
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
