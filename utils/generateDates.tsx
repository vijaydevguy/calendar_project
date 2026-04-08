export const generateCalendar = (date: any) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  // empty slots
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};



// export const generateCalendar = (date: any) => {
//   const year = date.getFullYear();
//   const month = date.getMonth();

//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const dates = [];

//   for (let i = 0; i < firstDay; i++) {
//     dates.push(null);
//   }

//   for (let i = 1; i <= daysInMonth; i++) {
//     dates.push(i);
//   }

//   return dates;
// };
