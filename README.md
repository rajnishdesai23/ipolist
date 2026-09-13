# IPO List India — Next.js & Firebase Real-Time Platform

A modern, SEO-optimized IPO & Grey Market Premium (GMP) intelligence platform built with **Next.js 14 (App Router)**, **Tailwind CSS**, **TypeScript**, and **Firebase Firestore**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.17 or later ([Download Node.js](https://nodejs.org/))
- **npm** (comes bundled with Node.js)

### 2. Install Dependencies
In your terminal, navigate to the extracted folder and run:
```bash
npm install
```

### 3. Environment Variables
Your `.env.local` file is already included. If needed, create or verify `.env.local` in the project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAm3Qg1BNJGnVrSyu3hAX5qiGXplvMhbmA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ipo-list-29f6e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ipo-list-29f6e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ipo-list-29f6e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=163545287634
NEXT_PUBLIC_FIREBASE_APP_ID=1:163545287634:web:42d5eee36308f80f67960b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SZCGET5FWX
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📁 Project Architecture & Key Features

- **Real-Time Data Scraper (`src/lib/scrapers/ipowatch.ts`)**:
  - Automatically fetches real-time Mainboard and SME IPOs from IPOWatch.
  - Deep crawls each IPO link to extract Market Lots, Reservation Quotas, Timelines, Financials, Valuation KPIs, Registrar details, and FAQs.
- **Firebase Firestore Integration (`src/lib/data/ipoRepository.ts`)**:
  - Syncs and persists scraped IPOs into your Firebase Firestore collection (`ipos`).
  - Gracefully bootstraps in-memory cache on cold starts.
- **Responsive Mobile & Desktop UI**:
  - Full mobile card views, segment filters (`All Market`, `Mainboard`, `SME`), status filters (`Live Now`, `Upcoming`, `Closed`), search bar, and clean typography.
- **SEO & Structured Data (`src/lib/seo/schema.ts`)**:
  - Automatic JSON-LD schema generation for Search Engines (FAQ Schema, Financial Product Schema, Article Schema, BreadcrumbList).
- **Tools & Calculators (`src/components/tools/`)**:
  - Interactive IPO Profit Calculator and Allotment Probability Estimator.

---

## 🛠️ Build for Production
To test or deploy a production build:
```bash
npm run build
npm start
```

