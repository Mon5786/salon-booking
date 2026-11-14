
# Salon Booking App

A full-stack salon appointment booking application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

The application allows customers to select a beauty service, choose a staff member, find an available appointment, and submit a booking.

## Features

- Select from different salon services
- Choose a preferred staff member or "Anyone"
- Select an available date and time
- Enter customer contact information
- Choose a payment method
- Review and confirm booking details
- Store bookings in Supabase
- Prevent overlapping appointments
- Display unavailable appointment times
- Handle booking errors and unavailable time slots
- Responsive user interface

## Technologies

- **Next.js 16** – React framework and API routes
- **React** – User interface
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Styling
- **Supabase** – PostgreSQL database and backend integration
- **Git & GitHub** – Version control

## Booking Process

1. Select a service.
2. Choose a staff member or "Anyone".
3. Select a date and available time.
4. Enter customer information.
5. Choose a payment method.
6. Review and confirm the appointment.
7. Receive a booking confirmation.

## Available Services

| Service | Duration | Price |
|---------|----------|-------|
| Haircut | 60 minutes | 550 SEK |
| Hair Color | 120 minutes | 1200 SEK |
| Balayage | 180 minutes | 1800 SEK |

## Booking Availability

The application checks existing bookings before allowing a new appointment.

Each service has a specific duration. The system checks for overlapping appointments to prevent double bookings.

Availability is checked in both the frontend and backend.

The PostgreSQL database also uses an exclusion constraint to prevent overlapping bookings for the same staff member, including simultaneous booking requests.

## Project Structure

```text
app/
├── api/
│   ├── availability/
│   └── bookings/
├── components/
│   ├── DateTimeSelection.tsx
│   └── StaffSelection.tsx
├── data/
│   └── bookingData.ts
├── lib/
│   └── supabaseServer.ts
└── page.tsx
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mon5786/salon-booking.git
cd salon-booking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Create a Supabase project and configure a `bookings` table with the required columns.

Add the required Supabase environment variables to a `.env.local` file using the variable names expected by the project's Supabase client configuration.

Never commit `.env.local` or secret API keys to GitHub.

The database must also be configured with the required booking validation and overlap-prevention constraints.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build

To create a production build:

```bash
npm run build
```

## Future Improvements

- Customer booking cancellation and rescheduling
- Staff management dashboard
- Email booking confirmations
- Online payment integration
- Dynamic service and staff management
- Automated tests

## Author

Mona Chabokdavan

GitHub: https://github.com/Mon5786
