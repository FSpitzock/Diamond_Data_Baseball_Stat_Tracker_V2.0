# ⚾ Diamond Data — Baseball Stat Tracker

Access the application here!

https://diamond-data-baseball-stat-tracker-v2-0.onrender.com/ 

Diamond Data is a full-stack youth baseball stat tracking application built to manage teams, players, and game performance.
It replaces localStorage with a real backend using **React + TypeScript + GraphQL + Apollo + MongoDB**.

Designed specifically for tracking real youth baseball teams — currently used for **Oviedo Outlaws 9U**.

---

# 📸 Features

### Team Management

* Create and manage team roster
* Edit player information
* Delete players
* Display jersey number and position
* Team name + logo support

### Game Stat Tracking

* Track per-game player stats
* Hits, singles, doubles, triples, HR
* RBI, walks, strikeouts
* At-bats tracking
* Team vs opponent support

### Backend Persistence

* MongoDB database
* GraphQL API
* Apollo Client integration
* No more localStorage

### UI Features

* Clean responsive layout
* Roster cards
* Game stat forms
* Team branding support
* Simplified navigation

---

# 🧰 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Apollo Client
* CSS

## Backend

* Node.js
* Express
* Apollo Server
* GraphQL
* MongoDB
* Mongoose
* JWT Authentication (optional)

## Deployment

* Render (Full stack)
* MongoDB Atlas

---

# 📂 Project Structure

```
Diamond_Data_Baseball_Stat_Tracker_V2.0
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── graphql
│   │   ├── styles
│   │   └── App.tsx
│
├── server
│   ├── src
│   │   ├── schemas
│   │   ├── models
│   │   ├── config
│   │   └── index.ts
│
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/Diamond_Data_Baseball_Stat_Tracker_V2.0.git
```

```
cd Diamond_Data_Baseball_Stat_Tracker_V2.0
```

---

## 2. Install Dependencies

### Client

```
cd client
npm install
```

### Server

```
cd ../server
npm install
```

---

## 3. Environment Variables

Create `.env` inside **server**

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=4000
```

---

## 4. Run Development Servers

### Start Backend

```
cd server
npm run dev
```

### Start Frontend

```
cd client
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:4000/graphql
```

---

# 📊 GraphQL Example

### Query Players

```
query GetPlayers {
  players {
    _id
    name
    number
    position
  }
}
```

### Add Player

```
mutation AddPlayer {
  addPlayer(name: "Frank", number: 7, position: "SS") {
    _id
    name
  }
}
```

---

# 🎯 Future Improvements

* Team batting averages
* Season stats leaderboard
* Pitching stats
* Game history view
* Export to CSV
* Parent login accounts
* Mobile layout improvements
* Multiple teams support

---

# 🏆 Real World Usage

Currently used for:

**Oviedo Outlaws 9U**
Tracking youth baseball performance and development.

---

# 📸 Screenshots

(You can add screenshots here)

```
![Home Page](./screenshots/home.png)
![Roster](./screenshots/roster.png)
![Stats](./screenshots/stats.png)
```

---

# 👨‍💻 Author

Frank Spitzock
Frontend Developer

GitHub
https://github.com/FSpitzock

Portfolio
https://fspitzock.github.io/Frank_Spitzock_Portfolio/

---

# 📄 License

MIT License

---

# ⭐ Why This Project Matters

This project demonstrates:

* Full stack architecture
* GraphQL API design
* Apollo integration
* MongoDB data modeling
* React state management
* Real-world problem solving
* UI/UX decisions
* Production deployment

---

# ⚾ Diamond Data

Built for coaches.
Built for parents.
Built for player development.
