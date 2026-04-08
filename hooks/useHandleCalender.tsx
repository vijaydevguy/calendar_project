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
  };
};

export default useHandleCalender;
