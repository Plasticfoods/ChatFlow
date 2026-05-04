# 💬 ChatFlow

A modern, full-stack real-time chat application built with **React** and **Node.js**. ChatFlow supports one-on-one messaging, group chats, file sharing, online presence indicators, QR code login, and multiple visual themes — all powered by WebSockets for instant communication.

## ✨ Features

### Messaging
- **Real-time messaging** via Socket.IO with instant delivery
- **One-on-one chats** and **group conversations**
- **File attachments** — share images and PDFs (via UploadThing)
- **Message delivery confirmation** with server acknowledgment

### User Experience
- **7 beautiful themes** — Light, Dark, Forest, Cyber Yellow, Midnight, Sunset Orange, and Rose
- **User search** — find and add contacts by name or username
- **Online/Offline presence** — see who's currently active in real time
- **QR code scanning** — quickly add contacts by scanning a QR code
- **Profile management** — update your avatar, name, and bio
- **Responsive design** — works on desktop and mobile with adaptive layouts

### Technical
- **JWT authentication** with secure HTTP-only cookies
- **Protected routes** — unauthenticated users are redirected to login
- **Smart error handling** — contextual error pages that distinguish between server downtime and network issues
- **Skeleton loaders** — smooth loading states throughout the app

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Material UI (MUI), Lucide Icons |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-time** | Socket.IO |
| **Authentication** | JWT, bcrypt.js |
| **File Uploads** | UploadThing |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **UploadThing** account — for file uploads ([uploadthing.com](https://uploadthing.com))

### 1. Clone the Repository

```bash
git clone https://github.com/Plasticfoods/ChatFlow.git
cd ChatFlow
```

### 2. Set Up Environment Variables

#### Server (`server/.env`)

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

```env
PORT=7070
NODE_ENV=development
CLIENT_URL=https://your-production-client-url.com
CLIENT_URL_LOCAL=http://localhost:5173
DOMAIN=https://your-production-server-url.com
DOMAIN_LOCAL=http://localhost:7070
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET_KEY=your_jwt_secret_key_here
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

#### Client (`client/.env`)

```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=https://your-production-server-url.com
VITE_API_URL_LOCAL=http://localhost:7070
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Start the server
cd server
npm run dev
```

```bash
# Terminal 2 — Start the client
cd client
npm run dev
```

The client will be available at **http://localhost:5173** and the server at **http://localhost:7070**.