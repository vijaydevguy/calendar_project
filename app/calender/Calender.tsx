"use client";
import { assets } from "@/assets/assets";
import useHandleCalender from "@/hooks/useHandleCalender";
import { generateCalendar } from "@/utils/generateDates";
import Image from "next/image";
import { useState } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const Calender = () => {
  const {
    monthImages,
    monthNames,
    handleNext,
    handlePrev,
    dates,
    currentDate,
    dayNames,
  } = useHandleCalender(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 flex h-screen w-full justify-center items-center">
      <div className="flex flex-col gap-6">
        {/* LEFT - IMAGE */}
        <div className="flex justify-center items-center">
          <Image
            src={monthImages[currentDate.getMonth()]}
            alt="calendar"
            width={400}
            height={400}
            className="rounded-xl object-cover select-none pointer-events-none max-h-[250px] h-[250px]"
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
            {dayNames.map((day) => (
              <p key={day}>{day}</p>
            ))}
          </div>
          {/* GRID */}
          <div className="grid grid-cols-7 gap-2">
            {dates.map((item, i) => {
              const isWeekend = i % 7 === 5 || i % 7 === 6;
              const cellDate = new Date(item.fullDate);
              cellDate.setHours(0, 0, 0, 0);

              const isToday = cellDate.getTime() === today.getTime();

              const isPast = cellDate < today;
              return (
                <button
                  key={i}
                  disabled={isPast}
                  className={`
                        h-10 flex items-center justify-center 
                        hover:bg-gray-100 rounded-full
                        {}
                        ${item.currentMonth ? "text-black" : "text-gray-400"}
                        ${isWeekend ? "text-red-500" : ""}
                        ${isPast ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                        ${isToday ? "bg-gray-700 text-white hover:bg-gray-700" : ""}
                        `}
                >
                  {item.day}
                </button>
              );
            })}
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
