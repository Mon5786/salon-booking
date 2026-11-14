
import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer";

const staff = [
  { id: 1, name: "Anna", serviceIds: [1, 2, 3] },
  { id: 2, name: "Sara", serviceIds: [1, 2] },
  { id: 3, name: "Emma", serviceIds: [1, 3] },
];

const serviceDurations: Record<number, number> = {
  1: 60,
  2: 120,
  3: 180,
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
  const requestedEnd =
    requestedStart + serviceDurations[requestedService];

  const bookedStart = toMinutes(bookedTime);
  const bookedEnd =
    bookedStart + serviceDurations[bookedService];

  return requestedStart < bookedEnd && bookedStart < requestedEnd;
}

export async function POST(request: Request) {
  try {
    const booking = await request.json();

    const serviceId = Number(booking.service_id);

    if (
      !Number.isInteger(serviceId) ||
      !serviceDurations[serviceId] ||
      !booking.staff_id ||
      typeof booking.booking_date !== "string" ||
      typeof booking.booking_time !== "string" ||
      typeof booking.customer_name !== "string" ||
      !booking.customer_name.trim() ||
      typeof booking.customer_contact !== "string" ||
      !booking.customer_contact.trim() ||
      !booking.payment_method
    ) {
      return NextResponse.json(
        { error: "Missing or invalid booking information" },
        { status: 400 }
      );
    }

    if (!["salon", "online"].includes(booking.payment_method)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    if (!availableTimes.includes(booking.booking_time)) {
      return NextResponse.json(
        { error: "Invalid booking time" },
        { status: 400 }
      );
    }

    const requestedStaff =
      booking.staff_id === "anyone"
        ? "anyone"
        : Number(booking.staff_id);

    if (
      requestedStaff !== "anyone" &&
      !Number.isInteger(requestedStaff)
    ) {
      return NextResponse.json(
        { error: "Invalid staff member" },
        { status: 400 }
      );
    }

    const eligibleStaff = staff.filter((person) =>
      person.serviceIds.includes(serviceId)
    );

    if (eligibleStaff.length === 0) {
      return NextResponse.json(
        { error: "Invalid service" },
        { status: 400 }
      );
    }

    const date = booking.booking_date;

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`)
        .toISOString()
        .slice(0, 10) !== date
    ) {
      return NextResponse.json(
        { error: "Invalid booking date" },
        { status: 400 }
      );
    }

    const now = new Date();

    const today = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    if (
      date < today ||
      (date === today &&
        toMinutes(booking.booking_time) <=
          now.getHours() * 60 + now.getMinutes())
    ) {
      return NextResponse.json(
        { error: "Cannot book a time in the past" },
        { status: 400 }
      );
    }

    // Get all appointments for the selected date.
    const { data: bookedSlots, error } = await supabaseServer
      .from("bookings")
      .select("staff_id, service_id, booking_time")
      .eq("booking_date", date);

    if (error) {
      console.error("Availability error:", error);

      return NextResponse.json(
        { error: "Failed to check availability" },
        { status: 500 }
      );
    }

    // Find staff members with no overlapping appointments.
    const freeStaff = eligibleStaff.filter(
      (person) =>
        !bookedSlots?.some(
          (slot) =>
            slot.staff_id === person.id &&
            hasOverlap(
              booking.booking_time,
              serviceId,
              slot.booking_time,
              slot.service_id
            )
        )
    );

    const assignedStaff =
      requestedStaff === "anyone"
        ? freeStaff[0]
        : freeStaff.find(
            (person) => person.id === requestedStaff
          );

    if (!assignedStaff) {
      return NextResponse.json(
        {
          error:
            "This time is unavailable. Please choose another time.",
        },
        { status: 409 }
      );
    }

    // Save the booking.
    const { data, error: insertError } = await supabaseServer
      .from("bookings")
      .insert({
        service_id: serviceId,
        staff_id: assignedStaff.id,
        booking_date: date,
        booking_time: booking.booking_time,
        customer_name: booking.customer_name.trim(),
        customer_contact: booking.customer_contact.trim(),
        payment_method: booking.payment_method,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      if (
        insertError.code === "23505" ||
        insertError.code === "23P01"
      ) {
        return NextResponse.json(
          {
            error:
              "This time slot has already been booked. Please choose another time.",
          },
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
      {
        message: "Booking confirmed",
        booking: data,
      },
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
