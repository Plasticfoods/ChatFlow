# 💬 ChatFlow

A modern, full-stack real-time chat application built with **React** and **Node.js**. ChatFlow supports one-on-one messaging, group chats, file sharing, online presence indicators, QR code login, and multiple visual themes — all powered by WebSockets for instant communication.

## ✨ Features

### Messaging
- **Real-time messaging** via Socket.IO with instant delivery
- **One-on-one chats** and **group conversations**
- **File attachments** — share images and PDFs (via UploadThing)
- **Read receipts** — see when your messages are read
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

## 📁 Project Structure

```
ChatFlow/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── AuthenticationPage2.jsx   # Login & Register pages
│   │   │   ├── Home.jsx                  # Main layout (Menu + ChatList + ChatWindow)
│   │   │   ├── ChatList.jsx              # Sidebar chat list
│   │   │   ├── ChatListItems.jsx         # Individual chat preview cards
│   │   │   ├── ChatWindow.jsx            # Active chat view with messages
│   │   │   ├── MessageBubble.jsx         # Single message display
│   │   │   ├── Menu.jsx                  # Navigation sidebar/bottom bar
│   │   │   ├── Settings.jsx              # User settings & theme switcher
│   │   │   ├── ProfilePage.jsx           # User profile editor
│   │   │   ├── UserSearchDrawer.jsx      # Search & add new contacts
│   │   │   ├── CreateGroupDrawer.jsx     # Group chat creation UI
│   │   │   ├── ChatInfoDrawer.jsx        # Chat/group details panel
│   │   │   ├── ErrorPage.jsx             # Dynamic error display
│   │   │   └── Loader.jsx                # Loading spinner
│   │   ├── context/            # React context providers
│   │   │   ├── User.jsx                  # Auth state & user data
│   │   │   ├── Chat.jsx                  # Chat state management
│   │   │   ├── Socket.jsx                # Socket.IO connection
│   │   │   ├── Theme.jsx                 # Theme management (7 themes)
│   │   │   ├── OnlineUsers.jsx           # Online presence tracking
│   │   │   └── Snackbar.jsx              # Toast notifications
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # App entry point with providers
│   └── vite.config.js          # Vite config with API proxy
│
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── app.js              # Express app entry point
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── models/
│   │   │   ├── user.model.js   # User schema (name, email, avatar, etc.)
│   │   │   ├── channel.model.js # Channel schema (DM & group chats)
│   │   │   └── message.model.js # Message schema (text, attachments, read receipts)
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login, Register, Logout
│   │   │   ├── userController.js    # User search, profile update
│   │   │   ├── channelController.js # CRUD for chats & groups
│   │   │   └── messageController.js # Send & fetch messages
│   │   ├── routes/             # Express route definitions
│   │   ├── middlewares/
│   │   │   └── auth.js         # JWT verification middleware
│   │   ├── socket/
│   │   │   └── socketHandler.js # Real-time event handlers
│   │   └── utils/
│   │       └── tokenUtils.js   # JWT token generation
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **UploadThing** account — for file uploads ([uploadthing.com](https://uploadthing.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ChatFlow.git
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

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive JWT cookie |
| `POST` | `/api/auth/logout` | Log out and clear cookie |
| `GET` | `/api/user` | Search users by name/username |
| `PUT` | `/api/user/update` | Update user profile |
| `POST` | `/api/channel` | Create or access a DM channel |
| `GET` | `/api/channel` | Fetch all user's channels |
| `POST` | `/api/channel/group` | Create a group channel |
| `PUT` | `/api/channel/rename` | Rename a group channel |
| `PUT` | `/api/channel/groupadd` | Add member to group |
| `PUT` | `/api/channel/groupremove` | Remove member from group |
| `DELETE` | `/api/channel/:channelId` | Delete a channel |
| `GET` | `/api/message/:channelId` | Fetch messages for a channel |
| `POST` | `/api/message` | Send a message |
| `POST` | `/api/uploadthing` | Upload file attachments |

## 🔄 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `setup` | Client → Server | Initialize user's socket room |
| `user_connected` | Server → Client | Confirm connection established |
| `new_message` | Client → Server | Send a new message |
| `receive_message` | Server → Client | Deliver message to recipients |
| `user_status_change` | Server → All | Broadcast online users list |
| `disconnect` | Auto | Cleanup on user disconnect |

## 🎨 Themes

ChatFlow comes with 7 built-in themes that can be switched from the Settings page:

| Theme | Primary Color | Style |
|-------|--------------|-------|
| Light | `#2F80ED` | Clean blue on white |
| Dark | `#60A5FA` | Blue on dark slate |
| Forest | `#10B981` | Green on mint |
| Cyber Yellow | `#F59E0B` | Amber on dark neutral |
| Midnight | `#C084FC` | Purple on pure black |
| Sunset Orange | `#F97316` | Orange on warm white |
| Rose | `#E11D48` | Red-pink on soft rose |

## 📄 License

This project is licensed under the ISC License.