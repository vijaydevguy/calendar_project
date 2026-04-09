"use client";
import { assets } from "@/assets/assets";
import useHandleCalender from "@/hooks/useHandleCalender";
import { generateCalendar } from "@/utils/generateDates";
import { getNotes, saveNotes } from "@/utils/notes";
import Image from "next/image";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight, FaExpand } from "react-icons/fa6";


const Calender = () => {
  const {
    monthImages,
    monthNames,
    handleNext,
    handlePrev,
    dates,
    currentDate,
    dayNames,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleDateClick,
    handleReset,
    COLORS,
    visibleRanges,
    monthStartTimestamp,
    monthEndTimestamp,
    handleSave,
    savedRanges,
    currentMonthKey,
    hasMonthNote,
    holidays,
    isLoadingHolidays,
    isRangeMode,
    isDayMode,
    today,
    allNotes,
    noteTitle,
    note,
    setNote,
  } = useHandleCalender(new Date());

  return (
    <div className="max-h-screen overflow-auto py-[5%]">
      <div className="max-w-5xl mx-auto p-4 flex h-full w-full justify-center items-center overflow-auto">
        <div className="flex flex-col gap-6">
          {/* LEFT - IMAGE */}
          <div className="relative flex justify-center items-center">
            <Image
              src={monthImages[currentDate.getMonth()]}
              alt="calendar"
              width={400}
              height={400}
              className="rounded-xl object-cover select-none pointer-events-none max-h-[250px] h-[250px]"
            />
            {(isDayMode || isRangeMode) && (
              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow text-gray-800 transition shadow-sm z-10"
                title="View Monthly Calendar"
              >
                <FaExpand size={16} />
              </button>
            )}
          </div>

          {/* RIGHT - CALENDAR + NOTES */}
          <div className="flex flex-col gap-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <button onClick={handlePrev}>
                <FaAngleLeft />
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl transition-all"
                onClick={handleReset}
                title="View Monthly Notes"
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold select-none">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </h2>
                  {isLoadingHolidays && (
                    <span className="text-xs font-semibold text-gray-400 animate-pulse">
                      fetching...
                    </span>
                  )}
                </div>
                {hasMonthNote && (
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-blue-500"
                    title="Monthly note available"
                  ></div>
                )}
              </div>
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

                const isPast = cellDate < today && !isToday;

                const isStart =
                  startDate && item.fullDate.getTime() === startDate.getTime();

                const isEnd =
                  endDate && item.fullDate.getTime() === endDate.getTime();

                const isInRange =
                  startDate &&
                  endDate &&
                  item.fullDate.getTime() > startDate.getTime() &&
                  item.fullDate.getTime() < endDate.getTime();

                const dayNoteKey = cellDate.toISOString().split("T")[0];
                const hasDayNote = !!allNotes[dayNoteKey];

                const cellTime = item.fullDate.getTime();
                const matchingRanges = savedRanges.filter(
                  (r) => cellTime >= r.startTime && cellTime <= r.endTime,
                );

                const holiday = holidays.find(
                  (h) =>
                    h.date.datetime.year === cellDate.getFullYear() &&
                    h.date.datetime.month === cellDate.getMonth() + 1 &&
                    h.date.datetime.day === cellDate.getDate(),
                );

                return (
                  <button
                    key={i}
                    onClick={() => {
                      handleDateClick(item.fullDate);
                    }}
                    className={`
                        h-10 flex flex-col items-center justify-center relative cursor-pointer
                        hover:bg-gray-100 rounded-full
                        {}
                        ${item.currentMonth ? "text-black" : "text-gray-400"}
                        ${isWeekend ? "text-red-500" : ""}
                        ${holiday ? "text-orange-500 bg-orange-50 font-bold" : ""}
                        ${isPast ? "opacity-40" : ""}
                        ${isToday ? "bg-gray-700 text-white hover:bg-gray-700" : ""}
                        ${isInRange ? "bg-blue-100" : ""}
                        ${isStart || isEnd ? "bg-blue-100 font-semibold" : ""}
                        `}
                    title={holiday ? holiday.name : ""}
                  >
                    <span className="z-10">{item.day}</span>

                    <div className={`flex gap-1 absolute bottom-1`}>
                      {hasDayNote && (
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-blue-500"
                          title="Day Note"
                        ></div>
                      )}
                      {holiday && (
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-orange-500"
                          title={holiday.name}
                        ></div>
                      )}
                      {matchingRanges.map((r, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${r.color}`}
                          title="Range Note"
                        ></div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* <form action={handleSave}> */}
            {/* SAVED RANGES CHIPS */}
            {visibleRanges.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center max-w-[250px]">
                <span className="text-sm font-medium text-gray-500">
                  Ranges:
                </span>
                {visibleRanges.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStartDate(r.start);
                      setEndDate(r.end);
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-full border border-gray-200 hover:bg-gray-200 transition cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full ${r.color}`}></div>
                    {r.start.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {r.end.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </button>
                ))}
              </div>
            )}

            {/* NOTES */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{noteTitle}</p>

              {isDayMode &&
                holidays.find(
                  (h) =>
                    h.date.datetime.year === startDate!.getFullYear() &&
                    h.date.datetime.month === startDate!.getMonth() + 1 &&
                    h.date.datetime.day === startDate!.getDate(),
                ) && (
                  <p className="text-orange-500  text-sm font-medium">
                    🎉 Holiday:{" "}
                    {
                      holidays.find(
                        (h) =>
                          h.date.datetime.year === startDate!.getFullYear() &&
                          h.date.datetime.month === startDate!.getMonth() + 1 &&
                          h.date.datetime.day === startDate!.getDate(),
                      )?.name
                    }
                  </p>
                )}

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write notes..."
                className="border rounded-md p-2 h-24 max-h-[120px] min-h-[54px]"
              />
            </div>

            <button
              onClick={() => handleSave()}
              className="bg-black text-white py-4 rounded-2xl cursor-pointer"
            >
              Save
            </button>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calender;
