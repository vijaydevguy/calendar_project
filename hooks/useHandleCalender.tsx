import { assets } from "@/assets/assets";
import { generateCalendar } from "@/utils/generateDates";
import { useEffect, useState } from "react";
import { dayNames, monthNames, monthImages, COLORS } from "@/common";
import { getNotes, saveNotes } from "@/utils/notes";

const useHandleCalender = (initialDate: Date) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [note, setNote] = useState("");
  const [allNotes, setAllNotes] = useState<Record<string, string>>({});

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isRangeMode = !!(startDate && endDate);
  const isDayMode = !!(startDate && !endDate);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  let noteTitle = "";

  if (isRangeMode) {
    noteTitle = `Notes for ${formatDate(startDate!)} → ${formatDate(endDate!)}`;
  } else if (isDayMode) {
    noteTitle = `Notes for ${formatDate(startDate!)}`;
  } else {
    noteTitle = `Notes for ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  let noteKey = "";

  if (isRangeMode) {
    noteKey = `${startDate!.toISOString()}_${endDate!.toISOString()}`;
  } else if (isDayMode) {
    noteKey = startDate!.toISOString().split("T")[0];
  } else {
    // noteKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    noteKey = `${currentDate.getFullYear()}-${month}`;
  }

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
  };
};

export default useHandleCalender;
