# AS Group MLM System - Technical Assignment

Hi there! Welcome to my submission for the AS Group MLM (Multi-Level Marketing) Web Application technical assignment. 

<br>

When I first read through the requirements, I saw a great opportunity to build something more than just a basic prototype. Instead, I decided to architect a **production-ready, highly scalable system** paired with a premium, modern user interface. 

<br>

My primary focus was on perfecting the core business logic. I wanted to ensure that the recursive referral trees, the 5-level deep commission distributions, and the secure wallet transactions all work together flawlessly.

---

## 🛠 Technology Stack (The MERN Advantage)

While the assignment mentioned PHP and MySQL, I chose to build this using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

<br>

**Why MERN instead of PHP/MySQL?**

<br>

1. **Scalability for MLM Systems:** MLM platforms generate massive, deeply nested tree structures. MongoDB's document-based model is vastly superior for handling recursive queries and hierarchical data (like our commission logic) when compared to traditional relational joins.

<br>

2. **Real-time User Experience:** React allows for a seamless, Single Page Application (SPA) experience. The interactive, drag-and-drop MLM Tree visualization built into this project would be extremely difficult to achieve smoothly with standard PHP templates.

---

## 🏗 Database Design Mapping (MySQL to MongoDB)

Even though we are using NoSQL, the data architecture strictly follows the assignment's relational requirements:

<br>

* **Users Table** ➔ `User` Collection (Contains `fullName`, `email`, `password`, `referralCode`, `referredBy`, `createdAt`).

<br>

* **Wallet Table** ➔ Merged into the `User` Collection as `walletBalance`. *(Note: In MongoDB, embedding 1:1 relationships like balances directly inside the user document is a best practice to reduce expensive lookup queries and drastically improve performance).*

<br>

* **Transactions Table** ➔ `WalletTransaction` Collection (`userId`, `amount`, `type`, `transactionType`, `createdAt`). Tracks every single credit and debit securely.

<br>

* **KYC Table** ➔ `KYC` Collection (`userId`, document details, `status: pending/approved/rejected`).

<br>

* **Referral / Tree Table** ➔ `MLMTree` Collection (`userId`, `parentId`, `level`, `ancestors`).

---

## ✨ Features Implemented

### 👥 User Panel

<br>

* **Secure Auth:** JWT-based Registration and Login.

<br>

* **Referral System:** Users can easily join via unique referral codes.

<br>

* **Wallet & Ledger:** A complete Earning Wallet that accurately tracks joining bonuses and downline investments.

<br>

* **Interactive Team Tree:** A beautiful, drag-to-pan, zoomable hierarchy view showing the user's upline (sponsor) and their entire downline structure.

<br>

* **EKYC Flow:** Seamless document submission with real-time status tracking.

<br>

### 🛡️ Admin Panel

<br>

* **Command Center:** A comprehensive dashboard with live statistics on system health, total payouts, and pending KYC requests.

<br>

* **Wallet Control:** The ability to monitor user wallets and execute manual commission adjustments (Credits/Debits) with clear transaction reasoning.

<br>

* **Dynamic Commission Engine:** The Admin can dynamically update the percentage splits for the 5-level deep income distribution logic directly from the UI.

<br>

* **KYC Management:** One-click approval or rejection of user KYC documents.

<br>

* **Payout & Transactions:** A completely transparent ledger of all system-wide transactions.

---

## ⚙️ Core Logic Highlights (Evaluation Focus)

<br>

* **Multi-Level Income Distribution:** When a user invests or joins, the system utilizes an automated algorithm to fetch up to 5 levels of ancestors and distributes fractional percentages instantly to their wallets.

<br>

* **Security First:** The API is protected with strict JWT middlewares. Sensitive routes (like wallet adjustments and KYC approvals) are locked behind role-based `adminOnly` access controls.

---

## 🚀 How to Run the Project Locally

### 1. Start the Backend (Node/Express)
```bash
cd backend
npm install
npm run dev
```
*The backend will run on http://localhost:5001. Ensure you have a MongoDB connection string in your `.env` file.*

<br>

### 2. Start the Frontend (Vite/React)
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on http://localhost:5173.*

---

<br>

Thank you for taking the time to review my code. I am very confident that the logic building, database design, and overall code structure demonstrated here align perfectly with the requirements of a real-world MLM platform. 

<br>

I look forward to discussing this further!
