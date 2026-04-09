"use client";
import { assets } from "@/assets/assets";
import useHandleCalender from "@/hooks/useHandleCalender";
import { generateCalendar } from "@/utils/generateDates";
import { getNotes, saveNotes } from "@/utils/notes";
import Image from "next/image";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight, FaExpand } from "react-icons/fa6";

// Add a simple interface for the Calendarific holiday response
interface Holiday {
  name: string;
  description: string;
  date: {
    iso: string;
    datetime: {
      year: number;
      month: number;
      day: number;
    };
  };
}

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
  } = useHandleCalender(new Date());

  const COLORS = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-pink-500",
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isRangeMode = startDate && endDate;
  const isDayMode = startDate && !endDate;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  let noteTitle = "";

  if (isRangeMode) {
    noteTitle = `Notes for ${formatDate(startDate)} → ${formatDate(endDate)}`;
  } else if (isDayMode) {
    noteTitle = `Notes for ${formatDate(startDate)}`;
  } else {
    noteTitle = `Notes for ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  let noteKey = "";

  if (isRangeMode) {
    noteKey = `${startDate.toISOString()}_${endDate.toISOString()}`;
  } else if (isDayMode) {
    noteKey = startDate.toISOString().split("T")[0];
  } else {
    // noteKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    noteKey = `${currentDate.getFullYear()}-${month}`;
  }

  const [note, setNote] = useState("");
  const [allNotes, setAllNotes] = useState<Record<string, string>>({});

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);

  // Fetch holidays when year changes
  useEffect(() => {
    const fetchHolidays = async () => {
      const apiKey = process.env.NEXT_PUBLIC_CALENDARIFIC_API_KEY;
      if (!apiKey) return;

      setIsLoadingHolidays(true);
      try {
        const year = currentDate.getFullYear();
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=IN&year=${year}`,
        );
        const data = await res.json();
        if (data?.response?.holidays) {
          setHolidays(data.response.holidays);
        }
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      } finally {
        setIsLoadingHolidays(false);
      }
    };

    fetchHolidays();
  }, [currentDate.getFullYear()]);

  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const hasMonthNote = !!allNotes[currentMonthKey];

  const savedRanges = Object.keys(allNotes)
    .filter((k) => k.includes("_"))
    .map((k, idx) => {
      const [s, e] = k.split("_");
      return {
        start: new Date(s),
        end: new Date(e),
        startTime: new Date(s).getTime(),
        endTime: new Date(e).getTime(),
        color: COLORS[idx % COLORS.length],
      };
    });

  useEffect(() => {
    const fetchedNotes = getNotes();
    setAllNotes(fetchedNotes);
    setNote(fetchedNotes[noteKey] || "");
  }, [noteKey]);

  const handleSave = () => {
    const fetchedNotes = getNotes();
    fetchedNotes[noteKey] = note;
    setAllNotes(fetchedNotes);
    saveNotes(fetchedNotes);
  };

  const monthStartTimestamp = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getTime();
  const monthEndTimestamp = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  ).getTime();

  const visibleRanges = savedRanges.filter(
    (r) => r.startTime <= monthEndTimestamp && r.endTime >= monthStartTimestamp,
  );

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
                    disabled={isPast}
                    onClick={() => {
                      if (isPast) return;
                      handleDateClick(item.fullDate);
                    }}
                    className={`
                        h-10 flex flex-col items-center justify-center relative
                        hover:bg-gray-100 rounded-full
                        {}
                        ${item.currentMonth ? "text-black" : "text-gray-400"}
                        ${isWeekend ? "text-red-500" : ""}
                        ${holiday ? "text-orange-500 font-bold" : ""}
                        ${isPast ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                        ${isToday ? "bg-gray-700 text-white hover:bg-gray-700" : ""}
                        ${isInRange ? "bg-blue-100" : ""}
                        ${isStart || isEnd ? "bg-blue-100 font-semibold" : ""}
                        `}
                    title={holiday ? holiday.name : ""}
                  >
                    <span className="z-10">{item.day}</span>
                    <div className="flex gap-1 absolute bottom-1">
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
              <div className="flex flex-wrap gap-2 items-center">
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
                    className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-full border hover:bg-gray-50 transition"
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
                    h.date.datetime.year === startDate.getFullYear() &&
                    h.date.datetime.month === startDate.getMonth() + 1 &&
                    h.date.datetime.day === startDate.getDate(),
                ) && (
                  <p className="text-orange-500  text-sm font-medium">
                    🎉 Holiday:{" "}
                    {
                      holidays.find(
                        (h) =>
                          h.date.datetime.year === startDate.getFullYear() &&
                          h.date.datetime.month === startDate.getMonth() + 1 &&
                          h.date.datetime.day === startDate.getDate(),
                      )?.name
                    }
                  </p>
                )}

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write notes..."
                className="border rounded-md p-2 h-24"
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
