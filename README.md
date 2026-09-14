# GUIDE

## INSTALL THIS FIRST
Before you begin, ensure you have the following installed on your local machine:
* **Node.js** (v18.0.0 or higher recommended)
* **Yarn** (Install globally via `npm install -g yarn`)
* **Git**

## Installation Guide

Follow these simple steps to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/DanielPallin/group-assignment.git
cd group-assignment
```

### 2. Install Root Dependencies
This project uses `concurrently` to run both the frontend and backend from a single command. Install the root dependencies first:
```bash
npm install
```

### 3. Install Backend Dependencies
Navigate to the backend folder and install the server packages:
```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies
Navigate to the frontend folder and install the React/Vite packages using Yarn:
```bash
cd ..
cd frontend
yarn install
cd ..
```

## Running the Application

You no longer need to open multiple terminal windows! Simply run the following command from the **root directory**:

```bash
npm run dev
```

This will automatically start:
* **Frontend (Vite):** `http://localhost:5173/` (blue terminal color)
* **Backend (Express/tsx):** `http://localhost:3000/` (pink terminal color)

## Code Standards & Conventions
* **Language:** ALL source code (variables, functions, classes, comments, file names) MUST be written in **English**.
* **Type Safety:** Always define explicit interfaces/types for data structures in TypeScript.
* **Git Standards:** Please use dev-branch first hand so we simply can review and fix problems before we merge.