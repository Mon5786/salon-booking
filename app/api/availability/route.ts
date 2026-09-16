import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabaseServer";


export async function GET() {
  const { data, error } = await supabaseServer
    .from("bookings")
    .select("staff_id, booking_date, booking_time");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}