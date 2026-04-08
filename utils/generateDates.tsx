export const generateCalendar = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  //   const firstDay = new Date(year, month, 1).getDay();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const days = [];

  // 🔹 Previous month dates
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    days.push({
      day: d,
      currentMonth: false,
      fullDate: new Date(year, month - 1, d),
    });
  }

  // 🔹 Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
      fullDate: new Date(year, month, i),
    });
  }

  // 🔹 Next month
  let nextDay = 1;
  while (days.length < 42) {
    days.push({
      day: nextDay,
      currentMonth: false,
      fullDate: new Date(year, month + 1, nextDay),
    });
    nextDay++;
  }

  return days;
};
// export const generateCalendar = (date: any) => {
//   const year = date.getFullYear();
//   const month = date.getMonth();

//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const days = [];

//   // empty slots
//   for (let i = 0; i < firstDay; i++) {
//     days.push(null);
//   }

//   // actual days
//   for (let i = 1; i <= daysInMonth; i++) {
//     days.push(i);
//   }

//   return days;
// };
