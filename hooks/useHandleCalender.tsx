import { assets } from "@/assets/assets";
import { generateCalendar } from "@/utils/generateDates";
import { useState } from "react";

const useHandleCalender = (initialDate: Date) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthImages = [
    assets.jan,
    assets.feb,
    assets.mar,
    assets.apr,
    assets.may,
    assets.jun,
    assets.jul,
    assets.aug,
    assets.sep,
    assets.oct,
    assets.nov,
    assets.dec,
  ];

  const [currentDate, setCurrentDate] = useState(initialDate);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateClick = (date: Date) => {
    // If no start → set start
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    // If start exists but no end → set end
    if (startDate && !endDate) {
      if (date < startDate) {
        // swap if user clicks earlier date
        setStartDate(date);
        setEndDate(startDate);
      } else {
        setEndDate(date);
      }
      return;
    }

    // If both exist → reset and start new
    setStartDate(date);
    setEndDate(null);
  };

  const handleNext = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handlePrev = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const dates = generateCalendar(currentDate);

  return {
    monthImages,
    monthNames,
    handleNext,
    handlePrev,
    dates,
    currentDate,
    setCurrentDate,
    dayNames,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleDateClick,
    handleReset,
  };
};

export default useHandleCalender;
