# ☁️ Event Planner Cloud

A cloud-based event management and RSVP platform built using **React, Vite, Firebase Authentication, Cloud Firestore, and FastAPI**.

The project allows users to register, log in, create events, view event details, and manage their RSVP status through a cloud-based application.

---

## 📌 Project Overview

**Event Planner Cloud** is a full-stack cloud application designed to simplify event creation and participation.

Users can create events with details such as title, description, date, time, venue, and capacity. Other authenticated users can view the events and respond with their RSVP status.

The project demonstrates how **frontend development, authentication, cloud databases, REST APIs, and security rules** can work together in a modern cloud application.

---

## ✨ Features

### 👤 User Authentication

* User registration and login
* Firebase Authentication
* Protected application access
* User-specific data handling

### 📅 Event Management

* Create new events
* Store event information in Cloud Firestore
* View upcoming events
* View individual event details
* Event information includes:

  * Event title
  * Description
  * Date
  * Time
  * Venue
  * Capacity

### 🙋 RSVP Management

* RSVP to an event
* Available RSVP statuses:

  * Going
  * Maybe
  * Not Going
* Update RSVP status
* User-specific RSVP records
* RSVP data stored in Cloud Firestore

### ☁️ Cloud Features

* Firebase Authentication
* Cloud Firestore database
* Firestore Security Rules
* Cloud-based event and RSVP storage
* Real-time RSVP data updates

### 🔐 Security

* Authentication-based access
* Firestore Security Rules
* Users can manage their own RSVP records
* Event creation is associated with the authenticated user

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    │  Register / Login    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    ┌────────────────────┐          ┌────────────────────┐
    │ Firebase Auth      │          │  Cloud Firestore   │
    │                    │          │                    │
    │ User Authentication│          │ Events             │
    │                    │          │ RSVPs              │
    └────────────────────┘          └─────────┬──────────┘
                                              │
                                              ▼
                                    ┌────────────────────┐
                                    │   Firestore Rules  │
                                    │ Authentication &   │
                                    │ Data Access Control│
                                    └────────────────────┘

                    ┌──────────────────────┐
                    │      FastAPI         │
                    │   Python Backend     │
                    └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* Tailwind CSS

### Backend

* Python
* FastAPI
* REST API

### Cloud Services

* Firebase Authentication
* Cloud Firestore
* Firebase Security Rules

### Development Tools

* Git
* GitHub
* VS Code
* npm

---

## 📂 Project Structure

```text
event-planner-cloud/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── serviceAccountKey.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── firebaseClient.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── firestore.rules
├── firebase.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Sanjay20-AS/event-planner-cloud.git
cd event-planner-cloud
```

---

## 2. Firebase Setup

Create a project from the Firebase Console.

Enable:

* **Authentication**
* **Email/Password Sign-in**
* **Cloud Firestore**

Then create a Firebase Web App.

Copy the Firebase configuration values.

---

## 3. Configure Frontend

Inside the `frontend` directory, create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your Firebase project configuration.

---

## 4. Configure Firebase Service Account

For the backend, go to:

**Firebase Console → Project Settings → Service Accounts**

Generate a new private key.

Save the downloaded file as:

```text
serviceAccountKey.json
```

Place it inside:

```text
backend/serviceAccountKey.json
```

⚠️ **Do not upload this file to GitHub.**

---

## 5. Configure Firestore Rules

Deploy the Firestore security rules from the project:

```bash
firebase deploy --only firestore:rules
```

The rules ensure that authenticated users can access events while event creation and RSVP modifications are associated with authenticated users.

---

# ▶️ Running the Backend

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ▶️ Running the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Application Flow

### 1. User Registration

```text
User
 ↓
Registration
 ↓
Firebase Authentication
 ↓
Authenticated User
```

### 2. Create Event

```text
Authenticated User
 ↓
Create Event Form
 ↓
Event Details
 ↓
Cloud Firestore
 ↓
Event Created
```

### 3. View Event

```text
Dashboard
 ↓
Select Event
 ↓
Event Details
 ↓
Cloud Firestore
 ↓
Display Event
```

### 4. RSVP

```text
User
 ↓
Select RSVP
 ↓
Going / Maybe / Not Going
 ↓
Cloud Firestore
 ↓
RSVP Status Updated
```

---

# 🔐 Firestore Security

Firestore Security Rules are used to control access to application data.

The application uses authentication to identify users and restrict operations based on the authenticated user's UID.

For example, users can create events associated with their own account and manage their own RSVP records.

This prevents the application from relying only on frontend restrictions for data access.

---

# 📊 Firestore Collections

## `events`

Example document:

```json
{
  "title": "AI & Cloud Technology Workshop",
  "description": "A hands-on workshop covering Artificial Intelligence, Cloud Computing, and modern web technologies.",
  "date": "2026-10-15",
  "time": "10:00 AM",
  "venue": "Seminar Hall, Dr. N.G.P. Institute of Technology",
  "capacity": 100,
  "organizer_id": "firebase-user-id"
}
```

## `rsvps`

Example document:

```json
{
  "event_id": "event-id",
  "user_id": "firebase-user-id",
  "status": "Going",
  "updated_at": "timestamp"
}
```

Each user has a separate RSVP record for an event.

---

# 🧪 Testing

The main application flow can be tested using the following steps:

* Register a new account
* Log in
* Create an event
* Verify the event appears on the dashboard
* Open event details
* Select **Going**
* Select **Maybe**
* Select **Not Going**
* Refresh the page
* Verify the RSVP status remains updated
* Check the corresponding documents in Firestore

---

# 🎯 Learning Outcomes

Through this project, I gained practical experience in:

* Cloud application development
* React frontend development
* FastAPI backend development
* Firebase Authentication
* Cloud Firestore
* Firestore Security Rules
* REST API architecture
* User authentication and authorization
* Cloud database management
* Real-time data handling
* Full-stack application development
* Git and GitHub workflow

---

# 🔮 Future Improvements

Possible future enhancements include:

* 📊 RSVP count and event capacity tracking
* 🔔 Event notifications
* 📧 Email notifications
* 👨‍💼 Organizer dashboard
* ✏️ Edit and delete events
* 🔎 Event search and filtering
* 📅 Calendar integration
* 📱 Improved mobile responsiveness
* 🖼️ Event image uploads using Firebase Storage
* 📈 Event analytics
* ☁️ Production deployment

---

# 👨‍💻 Author

**Sanjay A**

Computer Science and Business Systems
Dr. N.G.P. Institute of Technology
Coimbatore, Tamil Nadu, India

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is developed for educational and learning purposes.
