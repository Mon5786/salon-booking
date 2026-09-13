type StaffMember = {
  id: number;
  name: string;
  serviceIds: number[];
};

type StaffSelectionProps = {
  staff: StaffMember[];
  selectedService: number;
  selectedStaff: number | "anyone" | null;
  setSelectedStaff: (value: number | "anyone") => void;
  onBack: () => void;
};

export default function StaffSelection({
  staff,
  selectedService,
  selectedStaff,
  setSelectedStaff,
  onBack,

}: StaffSelectionProps) {
    const availableStaff = staff.filter((person) =>
  person.serviceIds.includes(selectedService)
);

  return (
    <div>
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
        Booking
      </p>

      <h1 className="text-4xl font-semibold text-stone-900">
        Choose your stylist
      </h1>

      <p className="mt-3 text-stone-600">
        Select who you would like to book with.
      </p>

      <div className="mt-8 grid gap-4">
        <button 
        onClick={() => setSelectedStaff("anyone")}
        className={`rounded-2xl border p-5 text-left transition ${
        selectedStaff === "anyone"
            ? "border-stone-900 bg-stone-900 text-white"
            : "border-stone-200 bg-white text-stone-900"
        }`}
        >
          <h2 className="text-lg font-semibold">Anyone</h2>
          <p
        className={`mt-1 text-sm ${
    selectedStaff === "anyone"
      ? "text-stone-300"
      : "text-stone-500"
  }`}
>
  Show me the first available time
</p>
        </button>
        

        {availableStaff.map((person) => (
        <button
            key={person.id}
            onClick={() => setSelectedStaff(person.id)}
            className={`rounded-2xl border p-5 text-left transition ${
            selectedStaff === person.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-900"
            }`}
        >
            <h2 className="text-lg font-semibold">{person.name}</h2>
            <p
                className={`mt-1 text-sm ${
                    selectedStaff === "anyone"
                        ? "text-stone-300"
                        : "text-stone-500"
                }`}
            >
                Show me the first available time
            </p>
        </button>
        ))}
        </div>

        {selectedStaff && (
        <button
            className="mt-6 w-full rounded-xl bg-stone-900 px-6 py-4 font-medium text-white"
        >
            Continue
        </button>
        )}

        <button
        onClick={onBack}
        className="mt-6 w-full rounded-xl border border-stone-300 px-6 py-4 font-medium text-stone-900"
        >
        ← Back
        </button>
    </div>
  );
}