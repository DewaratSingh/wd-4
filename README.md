# 🏙️ NagarSeva (नगरसेवा)

**A Smart Municipal Complaint & Infrastructure Management System**

NagarSeva is a premium, AI-driven platform designed to bridge the gap between citizens and municipal authorities. It leverages real-time data, geospatial tracking, and predictive analytics to prioritize and resolve urban issues efficiently.

---

## 🚀 Key Features

### 📊 Advanced Admin Dashboard
- **Strategic Analytics:** High-level overview of total complaints, resolution trends, and status distributions using **Recharts**.
- **Civic Priority Index:** A proprietary ranking system that identifies critical zones needing immediate intervention.
- **Activity Heatmaps:** Visualizes municipal responsiveness and complaint density across different wards.

### 🧠 Smart Priority Scoring
NagarSeva uses an intelligent algorithm to rank complaints (0-100) based on:
- **Vital Proximity:** Higher weightage for issues near **Hospitals** or **Schools**.
- **Environmental Impact:** Integrated weather analysis to predict **flooding risks** during rain.
- **Community Pulse:** Real-time upvoting system that allows citizens to flag urgent issues collectively.

### 🗺️ Live Geospatial tracking
- **Interactive Map:** A real-time Leaflet-powered map showing all reported issues with custom markers.
- **GPS-Locked Resolution:** Admins must provide **Proof of Resolution** (Live photo + Geotag) to close a complaint, ensuring authenticity.

### 🌍 Accessibility & UX
- **Multi-lingual Support:** Integrated Google Translate for a diverse citizen base.
- **Premium UI/UX:** Clean, modern interface with dark mode headers, glassmorphism effects, and smooth Framer Motion transitions.
- **Mobile Optimized:** Full-fledged webcam integration for reporting and resolution proof on the go.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 & Vanilla CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Maps:** React Leaflet

### Backend
- **Server:** Node.js + Express
- **Database:** PostgreSQL (with `pg` driver)
- **File Storage:** Cloudinary (for high-resolution complaint images)
- **Middleware:** Multer (for form-data processing)

---

## 📁 Project Structure

```bash
wd-4/
├── client/           # Next.js Frontend
│   ├── src/
│   │   ├── app/      # App Router & Pages
│   │   ├── components/ # Shared UI & Components
│   │   └── styles/   # Global styles
├── backend/          # Node.js Backend
│   ├── routes/       # API Endpoints
│   ├── config/       # Database & API Configs
│   └── index.js      # Server Entry Point
└── PPT_CONTENT.md    # Documentation/Presentation notes
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL
- Cloudinary Account (for image uploads)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=3000
# DATABASE_URL=your_postgres_db_url
# CLOUDINARY_URL=your_cloudinary_url
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:3001`.

---

## 📸 Proof of Resolution Flow
To ensure accountability, the system implements a strict resolution flow:
1. **Admin Review:** Admin views the complaint and sets status to "Work in Progress".
2. **On-Site Execution:** Field workers resolve the issue.
3. **Verified Submission:** Admin opens the camera within the app.
4. **GPS Validation:** The app verifies the worker's current location matches the complaint location.
5. **Resolution Image:** A proof photo is uploaded to Cloudinary, and the status is updated to "Resolved".

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## 📄 License
This project is licensed under the ISC License.

---
*Created with ❤️ for Mumbai Municipal Corporation.*
