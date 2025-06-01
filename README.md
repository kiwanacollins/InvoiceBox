# InvoiceBox

A simple invoice management system built with React, Tailwind CSS and TypeScript. Has separate dashboards for service providers and purchasers to create, track, and manage invoices.

The flowchart diagram of how the system works is included in the root folder(FLOWCHART.png).

## What the system does

- Create and send invoices
- Track payment status
- Dashboard with charts and stats
- Separate views for providers and clients
- Built with React, TypeScript, and Tailwind CSS for a clean, responsive design and rapid development
- Uses Zustand for state management and Chart.js for analytics
- Responsive design for mobile and desktop
- Easy to navigate with React Router
- Mock data for quick setup and testing

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling (I really focused on making the UI clean and modern with Tailwind)
- Zustand for state management
- Chart.js for the dashboard analytics
- React Router for navigation

## Getting Started

You need Node.js installed on your machine.

### Download & Setup

1. **Get the project**
   - Download as ZIP from GitHub or clone the repo
   - Extract and open the folder in your code editor

2. **Install dependencies**

   npm install
   This downloads all the packages needed to run the project.

3. **Start the dev server**

   npm run dev

   This starts the development server so you can view the site in the browser

The app will open at `http://localhost:5173`

## Quick Note

I used mock data instead of a real database since time was limited. Everything works as expected though:
 you can create invoices, 
 see the dashboards, 
 and navigate through all the features.
