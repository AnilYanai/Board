# 🎨 Board — Infinite Canvas Whiteboard

A high-performance, lightweight digital whiteboard built with **Next.js 16**, **React 18**, **HTML5 Canvas (2D)**, and **Zustand**. Designed for seamless drawing across desktop and mobile devices using a virtual viewport rendering engine.

---

## ✨ Features

- **Infinite Virtual Canvas:**
  - Viewport-sized canvas buffer (~98% VRAM reduction compared to fixed-size canvas textures).
  - Smooth pan and zoom in virtual world coordinate space.
  - Viewport culling skips off-screen strokes for sustained 60 FPS performance.
- **Drawing Tools:**
  - **Pen:** Instant dot rendering on touch/click with smooth continuous stroke tracing.
  - **Eraser:** Proximity collision detection with zoom-aware radius and continuous drag-to-erase.
  - **Pan / Hand:** Fluid canvas panning with mouse drag or trackpad.
  - **Selection:** Select single or multiple strokes (`Shift` + click) and drag them across the canvas.
  - **Color Picker & Size Slider:** Real-time hex color selection and brush size adjustment (1px–100px).
- **History & Actions:**
  - Undo and Redo stack management with Zustand.
  - Export canvas directly to high-resolution PNG (`Save`).
- **Touch & Gesture Support:**
  - Mobile-ready: Native 2-finger pinch-to-zoom and pan gestures.
  - Single-touch drawing with zero coordinate offset drift.
- **Authentication & Modular Database:**
  - Clean authentication pages (`/login` with Sign In and Registration).
  - Built-in **1-Click Demo Login** (`demo@example.com` / `password123`).
  - Swappable **In-Memory Database Adapter** (`src/lib/db.js`) following the repository pattern for easy future migration to PostgreSQL / Prisma / Supabase.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 18](https://react.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [styled-components](https://styled-components.com/) with SSR registry
- **Canvas Rendering:** HTML5 Canvas 2D Context (Virtual Coordinate Space)
- **Color Picker:** [react-colorful](https://github.com/omgovich/react-colorful)
- **Slider:** [rc-slider](https://github.com/react-component/slider)

---

## 📁 Project Structure

```text
Board/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/auth/             # Authentication API Route Handlers
│   │   │   ├── login/route.js    # Sign in endpoint
│   │   │   ├── logout/route.js   # Session destroy endpoint
│   │   │   ├── me/route.js       # Active session verification
│   │   │   └── register/route.js # Registration endpoint
│   │   ├── login/page.jsx        # Login & Sign up page
│   │   ├── layout.jsx            # Root HTML layout with style registry
│   │   └── page.jsx              # Main whiteboard entry point
│   ├── components/               # React UI Components
│   │   ├── ActionBar.jsx         # Undo, Redo, Save, and Auth controls
│   │   ├── CanvasBoard.jsx       # Viewport-sized canvas & gesture listener
│   │   ├── CanvasPage.jsx        # Canvas view wrapper
│   │   └── ToolBar.jsx           # Drawing tool selector & sliders
│   ├── constants/                # Tool enums & definitions
│   ├── hooks/                    # Custom React hooks
│   │   ├── useActionBar.js       # Undo/Redo/Save actions
│   │   └── useDrawingActions.js  # Canvas rendering pipeline & culling
│   ├── lib/                      # Core libraries & database
│   │   ├── db.js                 # Swappable in-memory database adapter
│   │   └── registry.jsx          # Styled-components SSR style registry
│   ├── store/                    # Zustand state management
│   │   ├── canvasStore.js        # Canvas ref, zoom level, pan offset
│   │   ├── historyStore.js       # Strokes and undo/redo stacks
│   │   ├── toolStore.js          # Active tool, color, size, and handlers
│   │   └── userStore.js          # Authentication state and user profile
│   ├── toolHandlers/             # Modular tool event handlers
│   │   ├── eraser.js             # Collision detection & stroke deletion
│   │   ├── pan.js                # Canvas panning logic
│   │   ├── pen.js                # Pen drawing & point management
│   │   └── selection.js          # Stroke selection & translation
│   └── utils/
│       ├── coordinates.js        # Screen-to-world coordinate transforms
│       └── idGenerator.js        # UUID generator for strokes
├── next.config.mjs               # Next.js configuration
└── package.json                  # Dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.17+ (v20+ recommended)
- **npm** or **yarn**

### 2. Installation
```bash
git clone https://github.com/AnilYanai/Board.git
cd Board
npm install
```

### 3. Development Server
Start the local Next.js development server:
```bash
npm run dev
```

Open [http://localhost:8001](http://localhost:8001) in your browser.

- Whiteboard: `http://localhost:8001/`
- Login Page: `http://localhost:8001/login`

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Database & PostgreSQL Migration

The project currently uses a modular in-memory database adapter in [`src/lib/db.js`](./src/lib/db.js).

To switch to **PostgreSQL**, **Prisma**, or **Supabase**, simply update the query functions inside [`src/lib/db.js`](./src/lib/db.js):
- `findUserByEmail(email)`
- `findUserById(id)`
- `createUser({ name, email, password })`
- `createSession(userId)`
- `getUserBySession(token)`

No changes are required in the frontend UI or API routes.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
