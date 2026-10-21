export const availableDates = Array.from({ length: 4 }, (_, index) => {
  const today = new Date();

  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + index
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayNumber = String(date.getDate()).padStart(2, "0");

  return {
    id: index + 1,

    day: date.toLocaleDateString("en-GB", {
      weekday: "short",
    }),

    date: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),

    value: `${year}-${month}-${dayNumber}`,
  };
});

export const availableTimes = ["09:00", "10:30", "12:00", "14:00", "15:30"];