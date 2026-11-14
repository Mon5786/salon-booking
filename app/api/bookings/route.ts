
import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer";

const staff = [
  { id: 1, name: "Anna", serviceIds: [1, 2, 3] },
  { id: 2, name: "Sara", serviceIds: [1, 2] },
  { id: 3, name: "Emma", serviceIds: [1, 3] },
];

export async function POST(request: Request) {
  try {
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
        { error: "Missing booking information" },
        { status: 400 }
      );
    }

    const validPaymentMethods = ["salon", "online"];

    if (!validPaymentMethods.includes(booking.payment_method)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const eligibleStaff = staff.filter((person) =>
      person.serviceIds.includes(Number(booking.service_id))
    );

    if (eligibleStaff.length === 0) {
      return NextResponse.json(
        { error: "Invalid service" },
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
        { error: "Failed to check availability" },
        { status: 500 }
      );
    }

    const freeStaff = eligibleStaff.filter(
      (person) =>
        !bookedSlots?.some((slot) => slot.staff_id === person.id)
    );

    const assignedStaff =
      booking.staff_id === "anyone"
        ? freeStaff[0]
        : freeStaff.find(
            (person) => person.id === Number(booking.staff_id)
          );

    if (!assignedStaff) {
      return NextResponse.json(
        { error: "This time is already booked" },
        { status: 409 }
      );
    }

    const { data, error: insertError } = await supabaseServer
      .from("bookings")
      .insert({
        service_id: Number(booking.service_id),
        staff_id: assignedStaff.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        customer_name: booking.customer_name,
        customer_contact: booking.customer_contact,
        payment_method: booking.payment_method,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "This time slot has already been booked. Please choose another time." },
          { status: 409 }
      );
    }

      console.error("Insert error:", insertError);
    
      return NextResponse.json(
        { error: "Failed to save booking" },
        { status: 500 }
      );
  }

    return NextResponse.json(
      { message: "Booking confirmed", booking: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
