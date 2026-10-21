import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer";

export async function POST(request: Request) {
  const booking = await request.json();

  if (
  !booking.service_id ||
  !booking.staff_id ||
  !booking.booking_date ||
  !booking.booking_time ||
  !booking.customer_name?.trim() ||
  !booking.customer_contact?.trim() ||
  !booking.payment_method
) {
  return NextResponse.json(
    { error: "Missing required booking information" },
    { status: 400 }
  );
}

const eligibleStaff = staff.filter((person) =>
  person.serviceIds.includes(booking.service_id)
);

if (eligibleStaff.length === 0) {
  return NextResponse.json(
    { error: "Invalid service" },
    { status: 400 }
  );
}

const validPaymentMethods = ["cash", "card"];

if (!validPaymentMethods.includes(booking.payment_method)) {
  return NextResponse.json(
    { error: "Invalid payment method" },
    { status: 400 }
  );
}

const { data: bookedSlots, error } = await supabaseServer
  .from("bookings")
  .select("staff_id")
  .eq("booking_date", booking.booking_date)
  .eq("booking_time", booking.booking_time);

if (error) {
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}

const freeStaff = eligibleStaff.filter(
  (person) =>
    !bookedSlots?.some((slot) => slot.staff_id === person.id)
);

console.log("Free staff:", freeStaff);

const assignedStaff =
  booking.staff_id === "anyone"
    ? freeStaff[0]
    : freeStaff.find(
        (person) => person.id === Number(booking.staff_id)
      );

console.log("Assigned staff:", assignedStaff);

if (!assignedStaff) {
  return NextResponse.json(
    { error: "No staff available at this time" },
    { status: 409 }
  );
}

const bookingToSave = {
  ...booking,
  staff_id: assignedStaff.id,
};

console.log("Booking to save:", bookingToSave);

console.log("Eligible staff:", eligibleStaff);

console.log("Booking received:", booking);
  return NextResponse.json({
    message: "Booking data received",
  });
}

const staff = [
  { id: 1, name: "Anna", serviceIds: [1, 2, 3] },
  { id: 2, name: "Sara", serviceIds: [1, 2] },
  { id: 3, name: "Emma", serviceIds: [1, 3] },
];