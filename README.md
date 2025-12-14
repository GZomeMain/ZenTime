# ⏳ ZenFocus Timer

ZenFocus Timer is a minimalist, distraction-free web application designed to help users focus using a Pomodoro-style timer.

### 🛠️ Tech Stack

* **Frontend:** React (with TypeScript)
* **Styling:** Tailwind CSS (via CDN) and Custom CSS
* **Build Tool:** Vite
* **Icons:** Lucide React

### 🚀 Getting Started

Follow these steps to run the application locally.

#### Prerequisites

Ensure you have **Node.js** and **npm** installed.

#### Installation & Run

1.  **Install dependencies** in your project root:
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically open at `http://localhost:5173/`.

### 📂 File Structure Highlights

* `App.tsx`: The main application component.
* `index.html`: Contains global styles, font imports, and the Tailwind CDN link.
* `index.tsx`: React mounting point.
* `components/`: Holds reusable UI components.
* `hooks/`: Contains custom logic (e.g., `useTimerEngine`).