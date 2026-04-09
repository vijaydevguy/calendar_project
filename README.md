# Calendar Note & Holiday App

A beautiful, interactive calendar application built with Next.js and Tailwind CSS. It features a robust note-taking system across specific days and date ranges, real-time holiday data integration, and a highly responsive premium design.

## 🚀 Live Demo

- **Production URL**: [https://calendarproject-five.vercel.app/](https://calendarproject-five.vercel.app/)
- **Preview Link**: [https://calendarproject-git-main-0105vijay02-gmailcoms-projects.vercel.app/](https://calendarproject-git-main-0105vijay02-gmailcoms-projects.vercel.app/)

## ✨ Key Features

- **Dynamic Interactive Calendar**: Navigate through months and years seamlessly with custom monthly headers and imagery.
- **Advanced Note System**:
  - **Daily Notes**: Click on any day to attach a specific note. Blue indicator dots reveal where notes are saved.
  - **Range Notes (Vacations/Leaves)**: Select a start date and an end date to create a multi-day event. Your selected ranges display as distinct, color-coded visual chips and dots.
  - **Monthly Notes**: Click directly on the Month/Year header to attach a high-level note for the entire month.
- **Real Holidays & Festivals Integration**:
  - Fetches accurate, real holiday data dynamically via the [Calendarific API](https://calendarific.com/).
  - Holidays are highlighted visually in vibrant orange.
  - **Desktop:** Hover over a holiday date to see the festival's name in a sleek tooltip.
  - **Mobile Friendly:** Clicking on a holiday date reveals the festival's name directly in the notes panel!
- **Data Persistence**: All notes, ranges, and calendar states are safely and securely stored in your browser's local storage.
- **Performance Optimized**: Clean architecture with separated UI and logical concerns via custom hooks (`useHandleCalender`). Range indicators are smartly filtered to only show data relevant to the current month to optimize UX.

## 🛠️ Tech Stack

- **Framework**: React / Next.js (App Router)
- **Styling**: Tailwind CSS
- **External API**: Calendarific (Global Holidays)
- **Storage**: LocalStorage
- **Icons**: React Icons (FaAngleLeft, FaAngleRight, FaExpand)

---

## 💻 Getting Started (Local Development)

Follow these steps to set up and run the calendar on your local machine.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd calendar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

This application requires a free Calendarific API key to fetch and display real-world holidays.

1. Go to [Calendarific.com](https://calendarific.com/) and register for a free account.
2. Copy your API key from the dashboard.
3. Locate the `.env.example` file in the root directory and rename it to `.env.local` (or create a new `.env.local` file).
4. Add your API key:

```env
NEXT_PUBLIC_CALENDARIFIC_API_KEY=your_actual_api_key_here
```

### 4. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧪 How to View and Test Features

1. **Test Navigation**: Click the left/right angle arrows to switch months. Notice the top header image gracefully changes to reflect the season of the current month.
2. **Test Daily Notes**: 
   - Click on a specific date. 
   - On the right panel, type a note in the textarea and hit "**Save**". 
   - A blue indicator dot will instantly appear under that date.
3. **Test Range Notes**: 
   - Click a Start Date `(e.g., Aug 12)`.
   - Click an End Date `(e.g., Aug 18)`.
   - The UI will highlight the range boundaries. Write a note and hit "**Save**". 
   - You should see a highly visible colored range chip appear at the bottom, and colored dots populate the cells inside the calendar grid!
   - Navigate to the next month; observe that the previous month's range chips disappear, keeping the UX clean.
4. **Test Holidays**: 
   - Ensure your `.env.local` API key is active. Look for dates highlighted with bold orange text. 
   - Hover over the date (desktop) or Click the date (mobile) to verify the correct holiday/festival title appears.

---
*Developed with ❤️ using Next.js & TailwindCSS*
