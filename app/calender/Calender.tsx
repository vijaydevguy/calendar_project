"use client";
import { assets } from "@/assets/assets";
import { generateCalendar } from "@/utils/generateDates";
import Image from "next/image";
import { useState } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Calender = () => {
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

  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="max-w-5xl mx-auto p-4 flex h-screen w-full justify-center items-center">
      <div className="flex flex-col gap-6">
        {/* LEFT - IMAGE */}
        <div className="flex justify-center items-center">
          <Image
            src={assets.img}
            alt="calendar"
            width={400}
            height={400}
            className="rounded-xl object-cover select-none pointer-events-none"
          />
        </div>

        {/* RIGHT - CALENDAR + NOTES */}
        <div className="flex flex-col gap-4">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <button onClick={handlePrev}>
              <FaAngleLeft />
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNext}>
              <FaAngleRight />
            </button>
          </div>

          {/* DAYS HEADER */}
          <div className="grid grid-cols-7 text-center font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <p key={day}>{day}</p>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-7 gap-2">
            {dates.map((day, i) => (
              <div
                key={i}
                className="h-10 flex items-center justify-center border border-gray-200 rounded-md"
              >
                {day || ""}
              </div>
            ))}
          </div>

          {/* NOTES */}
          <textarea
            placeholder="Write notes..."
            className="border rounded-md p-2 h-24 max-h-[120px] min-h-[48px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Calender;
