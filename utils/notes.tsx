const STORAGE_KEY = "calendar-notes";

export const getNotes = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
};

export const saveNotes = (data: Record<string, string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
