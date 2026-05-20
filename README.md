# 🛕 BAPS Chikhodara Mandal — Kids Trip QR Attendance

A React web app for managing QR-based attendance for BAPS Chikhodara Mandal kids trips.

## Features
- 📷 QR code scanning for attendance
- 🧒 Separate Balak & Yuvak segments
- 🗺️ Multi-stop trip tracking
- 🪪 Printable QR ID cards
- 📋 Full attendance sheet view

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

## How to Use

1. **Setup tab** — Add trip stops and register kids (Balak/Yuvak)
2. **QR Cards tab** — Print QR cards and give one to each kid
3. **Scan tab** — Select active stop, scan/type kid ID to mark attendance
4. **Kids tab** — View all kids and their attendance status
5. **Sheet tab** — Full attendance matrix view

## Project Structure

```
baps-chikhodara-trip/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx      ← React entry point
    └── App.jsx       ← Main app component (all UI + logic)
```

## Tech Stack
- React 18
- Vite
- Pure CSS (no external UI library)

---
🙏 Jai Swaminarayan · BAPS Chikhodara Mandal
