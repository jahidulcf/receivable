# Receivable - Account Receivable Management Web App

A modern, minimal mobile-first web application for small business owners to track customer outstanding balances, record credit sales, receive payments, and manage their receivables.

## Features

✅ **Customer Management** - Add, edit, and delete customers with validation
✅ **Transaction Tracking** - Record dues and payments
✅ **Outstanding Calculation** - Real-time balance tracking
✅ **Search & Filter** - Find customers and sort by various criteria
✅ **Statement Sharing** - Share customer statements via Web Share API or clipboard
✅ **Backup & Restore** - Export/import with SHA-256 integrity verification
✅ **Offline Support** - PWA with service worker for offline functionality
✅ **Multilingual** - English & Bengali support
✅ **Mobile-First** - Responsive design optimized for mobile devices
✅ **Monochrome Aesthetic** - Notion-inspired colors

## Tech Stack

- React 18 + Vite
- React Router v6
- Zustand (State Management)
- Tailwind CSS
- localStorage (Data Persistence)
- Service Workers (Offline Support)
- PWA
- CryptoJS (SHA-256)

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at http://localhost:3000

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx
│   ├── CustomerDetail.jsx
│   └── Settings.jsx
├── components/
│   ├── Header.jsx
│   ├── CustomerList.jsx
│   ├── TransactionList.jsx
│   ├── Modal.jsx
│   ├── Button.jsx
│   ├── ConfirmDialog.jsx
│   ├── EmptyState.jsx
│   └── Toast.jsx
├── services/
│   ├── storageService.js
│   ├── backupService.js
│   └── hashService.js
├── stores/
│   └── store.js
├── i18n/
│   ├── en.json
│   └── bn.json
├── utils/
│   ├── validation.js
│   ├── formatting.js
│   └── i18n.js
├── App.jsx
├── main.jsx
└── index.css
```

## Deployment

Deployed on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

```bash
vercel
```

## License

MIT