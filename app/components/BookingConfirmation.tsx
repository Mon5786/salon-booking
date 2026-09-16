

type BookingConfirmationProps = {
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  customerName: string;
  customerContact: string;
  paymentMethod: "online" | "salon";
  onConfirm: () => void;
  isSaving: boolean;
};

export default function BookingConfirmation({
  serviceName,
  staffName,
  date,
  time,
  customerName,
  customerContact,
  paymentMethod,
  onConfirm,
  isSaving,
}: BookingConfirmationProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
        Booking
      </p>

      <h1 className="text-4xl font-semibold text-stone-900">
        Confirm your booking
      </h1>

      <p className="mt-3 text-stone-600">
        Please check your booking details.
      </p>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <p className="text-sm text-stone-500">Service</p>
        <p className="mt-1 font-semibold text-stone-900">
            {serviceName}
        </p>

        <div className="mt-4 border-t border-stone-200 pt-4">
            <p className="text-sm text-stone-500">Stylist</p>
            <p className="mt-1 font-semibold text-stone-900">
                {staffName}
            </p>
        </div>

        <div className="mt-4 border-t border-stone-200 pt-4">
            <p className="text-sm text-stone-500">Date & Time</p>
            <p className="mt-1 font-semibold text-stone-900">
                {date} at {time}
            </p>
        </div>

        <div className="mt-4 border-t border-stone-200 pt-4">
            <p className="text-sm text-stone-500">Customer</p>
            <p className="mt-1 font-semibold text-stone-900">
                {customerName}
            </p>
            <p className="mt-1 text-stone-600">
                {customerContact}
            </p>
        </div>

        <div className="mt-4 border-t border-stone-200 pt-4">
            <p className="text-sm text-stone-500">Payment</p>
            <p className="mt-1 font-semibold text-stone-900">
                {paymentMethod === "online" ? "Pay online" : "Pay at salon"}
            </p>
        </div>
        <button
          onClick={onConfirm}
          disabled={isSaving}
          className="mt-6 w-full rounded-xl bg-stone-900 px-6 py-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Booking..." : "Confirm booking"}
        </button>
    </div>  
    </div>
  );
}