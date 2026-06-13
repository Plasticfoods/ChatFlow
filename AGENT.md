# 🤖 AGENT.md — ChatFlow System Architecture Guide

> **Purpose**: This document serves as the definitive reference for any developer or AI agent working on this codebase. Read this file **before** making any changes to understand the system architecture, conventions, and constraints.
>
> **Last Updated**: 2026-06-13

---

## 1. System Overview & Tech Stack

ChatFlow is a **full-stack, real-time chat application** supporting one-on-one messaging, group conversations, file attachments, online presence tracking, QR code contact sharing, and 7 visual themes.

### Architecture Pattern

**Client-Server Monorepo** — Two independent Node.js applications communicating via REST API and WebSockets.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ChatFlow Monorepo                          │
│                                                                     │
│  ┌──────────────────────┐          ┌──────────────────────────────┐ │
│  │   client/ (React)    │  HTTP    │     server/ (Express 5)      │ │
│  │   Vite Dev: :5173    │─────────►│     API Server: :7070        │ │
│  │                      │  REST    │                              │ │
│  │   React 19 SPA       │◄─────────│     MongoDB (Mongoose)       │ │
│  │   MUI Components     │          │                              │ │
│  │                      │ Socket.IO│     JWT Auth (HTTP-only      │ │
│  │   socket.io-client   │◄────────►│     cookies)                 │ │
│  │                      │  (WSS)   │                              │ │
│  └──────────────────────┘          │     UploadThing (Files)      │ │
│                                    └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Tech Stack Table

| Layer | Technology | Version | Module System |
|-------|-----------|---------|---------------|
| **Frontend** | React | 19.2.0 | ESM |
| **Build Tool** | Vite | 7.2.4 | ESM |
| **UI Framework** | Material UI (MUI) | 7.3.5 | ESM |
| **Icons** | Lucide React + MUI Icons | Latest | ESM |
| **Routing** | React Router DOM | 7.9.6 | ESM |
| **HTTP Client** | Axios | 1.13.2 | ESM |
| **Real-time (Client)** | socket.io-client | 4.8.3 | ESM |
| **QR Code** | qrcode.react + @yudiel/react-qr-scanner | Latest | ESM |
| **Backend Runtime** | Node.js | 18+ | — |
| **Web Framework** | Express | 5.2.1 | **CommonJS** |
| **Database** | MongoDB (Mongoose ODM) | 8.1.1 | CommonJS |
| **Real-time (Server)** | Socket.IO | 4.8.3 | CommonJS |
| **Authentication** | jsonwebtoken + bcryptjs | Latest | CommonJS |
| **File Uploads** | UploadThing | 7.7.4 | CommonJS |
| **Dev Tool** | nodemon | 3.1.11 | — |
| **Linter** | ESLint (flat config) | 9.39.1 | ESM |

> ⚠️ **Critical**: The client uses **ES Modules** (`import/export`). The server uses **CommonJS** (`require/module.exports`). Do not mix them.

---

## 2. Folder Directory Breakdown

```
ChatFlow/
├── .gitignore                       # Root gitignore (node_modules, .env, build, design/)
├── README.md                        # Project README with setup instructions
├── AGENT.md                         # ← You are here
│
├── client/                          # ────── FRONTEND (React + Vite) ──────
│   ├── .env.example                 # VITE_API_URL, VITE_API_URL_LOCAL
│   ├── .gitignore                   # Client-specific ignores
│   ├── eslint.config.js             # Flat ESLint config: react-hooks, react-refresh
│   ├── index.html                   # Vite HTML entry point
│   ├── package.json                 # type: "module" (ESM)
│   ├── vite.config.js               # Dev proxy: /api → :7070, /socket.io → :7070 (ws)
│   ├── public/                      # Static assets served at /
│   └── src/
│       ├── main.jsx                 # ★ React root: provider nesting order
│       ├── App.jsx                  # ★ Route definitions + Axios baseURL config
│       ├── App.css                  # Global application styles (layout, themes via CSS vars)
│       ├── index.css                # CSS reset / base styles
│       │
│       ├── assets/                  # Static images
│       │   ├── default-group-avatar.jpg
│       │   ├── default-user-icon-13.jpg
│       │   └── default_user_avatar.jpg
│       │
│       ├── components/              # ★ All UI Components
│       │   ├── AuthenticationPage.jsx     # Auth page v1 (legacy)
│       │   ├── AuthenticationPage2.jsx    # ★ Active auth — exports LoginPage, RegisterPage
│       │   ├── Home.jsx                   # ★ Main layout: Menu + ChatList + ChatWindow
│       │   ├── Menu.jsx                   # Navigation sidebar
│       │   ├── ChatList.jsx               # List of chat channels
│       │   ├── ChatListItems.jsx          # Individual chat list item
│       │   ├── ChatWindow.jsx             # ★ Active chat area: messages + input
│       │   ├── ChatWindow.css             # ChatWindow-specific styles
│       │   ├── MessageBubble.jsx          # Individual message rendering
│       │   ├── MessageBubble.css          # Message bubble styles
│       │   ├── AddChatSection.jsx         # User search + add new chat
│       │   ├── UserSearchDrawer.jsx       # User search drawer (search API)
│       │   ├── CreateGroupDrawer.jsx      # Group chat creation UI
│       │   ├── ChatInfoDrawer.jsx         # Chat details sidebar
│       │   ├── Settings.jsx               # ★ Theme picker + account settings
│       │   ├── Settings.css               # Settings page styles
│       │   ├── ProfilePage.jsx            # User profile view/edit
│       │   ├── ProtectedRoute.jsx         # Auth guard — redirects to /login if no user
│       │   ├── ErrorPage.jsx              # Error boundary / error display
│       │   ├── Loader.jsx                 # Full-screen / overlay spinner
│       │   ├── SkeletonLoader.jsx         # Skeleton loading placeholders
│       │   ├── Contacts.jsx               # Contacts page (minimal)
│       │   ├── Navbar.css                 # Navbar styles
│       │   ├── ChatWindowBkp.jsx          # Backup file (inactive)
│       │   ├── ChatWindowOld.jsx          # Old version (inactive)
│       │   ├── Settings_Bkp.jsx           # Backup file (inactive)
│       │   ├── temp.css                   # Temporary styles (inactive)
│       │   └── tempData.js                # Mock/temp data for development
│       │
│       ├── context/                 # ★ React Context Providers (Global State)
│       │   ├── User.jsx             # Auth state: user, login, register, logout, updateProfile
│       │   ├── Socket.jsx           # Socket.IO connection lifecycle
│       │   ├── OnlineUsers.jsx      # Online user presence tracking (Set-based)
│       │   ├── Chat.jsx             # Chat state: channels, messages, sendMessage
│       │   ├── Theme.jsx            # 7 themes via CSS custom properties
│       │   └── Snackbar.jsx         # Global notification system (MUI Alert)
│       │
│       ├── hooks/                   # Custom React Hooks
│       │   └── mobileSreenHook.js   # useIsMobile(breakpoint) — responsive detection
│       │
│       └── utils/                   # Utility Functions
│           ├── formatTime.js        # ISO timestamp → "4:19 PM" / "Yesterday" / "09/01/2026"
│           └── uploadthing.js       # UploadButton component (generated via @uploadthing/react)
│
└── server/                          # ────── BACKEND (Express 5 + Socket.IO) ──────
    ├── .env.example                 # PORT, NODE_ENV, CLIENT_URL, DATABASE_URL, JWT_SECRET, UPLOADTHING_TOKEN
    ├── package.json                 # type: "commonjs", main: "src/app.js"
    └── src/
        ├── app.js                   # ★ Server entry: Express + Socket.IO + UploadThing init
        │
        ├── config/
        │   ├── db.js                # Mongoose connection (DATABASE_URL from .env)
        │   └── uploadthing.js       # UploadThing route handler: image (4MB), PDF (4MB), text (64KB)
        │
        ├── controllers/             # ★ Business Logic
        │   ├── authController.js    # register, login, logout
        │   ├── channelController.js # accessChannel, fetchChannels, createGroupChannel, deleteChannel
        │   │                        #   + renameGroup, addToGroup, removeFromGroup (defined but unrouted)
        │   ├── messageController.js # sendMessage (REST), sendMessage2 (Socket.IO), getMessages
        │   └── userController.js    # searchUsers, getUserProfile, updateUserProfile
        │
        ├── middlewares/
        │   └── auth.js              # checkAuthentication (JWT from cookie) + checkAuthorization (RBAC)
        │
        ├── models/                  # ★ Mongoose Schemas
        │   ├── user.model.js        # User (name, email, username, password, avatar, about, role)
        │   ├── channel.model.js     # Channel (channelName, users[], latestMessage, isGroupChannel, soft delete)
        │   └── message.model.js     # Message (sender, content, attachment, channel, readBy[])
        │
        ├── routes/                  # Express Router Definitions
        │   ├── index.js             # Route aggregator: /auth, /user, /channel, /message
        │   ├── authRoutes.js        # POST /register, /login, /logout
        │   ├── channelRoutes.js     # POST / GET / DELETE channels
        │   ├── messageRoutes.js     # POST / GET messages
        │   └── userRoutes.js        # GET search, GET/PUT profile
        │
        ├── socket/
        │   └── socketHandler.js     # ★ Socket.IO event handlers: setup, new_message, disconnect
        │
        └── utils/
            └── tokenUtils.js        # JWT generate, setAuthCookie (HTTP-only), clearAuthCookie
```

---

## 3. Core Architecture Logic & Data Flow

### 3.1 Authentication Flow

```
                     ┌─────────────────────────────────────────┐
                     │             Authentication               │
                     └─────────────────────────────────────────┘

  Client (User.jsx)                                  Server (authController.js)
  ────────────────                                   ────────────────────────────
  1. User submits login/register form
  2. POST /api/auth/login                ──────────► 3. Find user by email OR username
     {email, password}                               4. bcrypt.compare(password, hash)
                                                     5. generateToken(userId) → JWT (2d expiry)
  7. Set user state ◄─── JSON response ◄──────────── 6. res.cookie("acess_token", jwt, {
  8. SocketProvider connects                              httpOnly, secure, sameSite: "none"
     socket, emits "setup"                              })
                                                        Return: {_id, name, email, role, avatar}

  On page reload:
  9. UserProvider.useEffect()
     GET /api/user/profile               ──────────► 10. checkAuthentication middleware
                                                         reads req.cookies.acess_token
  11. Restore user state ◄──────────────◄──────────── 12. jwt.verify → find User by ID
```

> **Note**: The cookie name is `acess_token` (typo is intentional/legacy — do NOT rename without updating both server middleware and tokenUtils).

### 3.2 Real-time Messaging Flow

```
  Client A (sender)              Socket.IO Server              Client B (receiver)
  ─────────────────              ──────────────────             ──────────────────
  1. User types message
  2. ChatProvider.sendMessage()
     → Optimistic update:
       add msg to messages[]
     → socket.emit("new_message",
       message, callback)
                                 3. socketHandler receives
                                    "new_message" event
                                 4. sendMessage2(message)
                                    → Message.create() in MongoDB
                                    → Channel.findByIdAndUpdate
                                      (set latestMessage)
                                 5. For each user in channel
                                    (skip sender):
                                    socket.to(userId).emit(
                                      "receive_message",
                                      {newMessage, channel}
                                    )                           6. ChatProvider receives
                                                                   "receive_message"
                                                                7. Append to messages[]
                                                                8. Update chat list order

                                 9. Acknowledge sender via
                                    callback({success, msg})
  10. Replace optimistic msg
      with DB-confirmed msg
  11. Update chat list order
```

**Key Design Decisions**:
- Messages are sent **exclusively via Socket.IO** (not REST) using `sendMessage2` on the server
- The REST `sendMessage` endpoint exists but is not actively used by the client
- **Optimistic updates** show the message instantly, then swap with the server-confirmed version
- If the acknowledgment fails, the optimistic message is removed and a snackbar error is shown

### 3.3 Online Presence System

```
  Server: socketHandler.js
  ─────────────────────────
  userSocketMap = Map<UserId, Set<SocketId>>

  On "setup":
    → Add socket.id to user's Set
    → Broadcast ALL active user IDs to everyone

  On "disconnect":
    → Remove socket.id from user's Set
    → If Set is empty → user is fully offline
    → Broadcast updated active user list

  Client: OnlineUsers.jsx
  ────────────────────────
  Listens for "user_status_change" → stores as Set<UserId>
  isUserOnline(userId) → O(1) lookup
```

This supports **multi-tab/multi-device** — a user is only marked offline when ALL their sockets disconnect.

### 3.4 Theme System

Managed via CSS custom properties applied to `document.body.style`. Seven themes defined in `Theme.jsx`:

| Index | Theme | Type |
|-------|-------|------|
| 0 | Light | Light |
| 1 | Dark | Dark |
| 2 | Forest | Light |
| 3 | Cyber Yellow | Dark |
| 4 | Midnight | Dark |
| 5 | Sunset Orange | Light |
| 6 | Rose | Light |

CSS variables used: `--primary`, `--primary-rgb`, `--primary-hover`, `--secondary`, `--bg-main`, `--bg-surface`, `--border-color`, `--text-main`, `--text-dim`, `--text-muted`, `--text-inverse`, `--radius-md`, `--radius-full`.

Theme selection is persisted to `localStorage` (key: `app-theme`).

---

## 4. Active Key Dependencies & Third-Party Integrations

### 4.1 UploadThing (File Uploads)

| Aspect | Detail |
|--------|--------|
| **Server Config** | `server/src/config/uploadthing.js` — defines `chatAttachment` endpoint |
| **Server Route** | Mounted at `/api/uploadthing` via `createRouteHandler` in `app.js` |
| **Client Util** | `client/src/utils/uploadthing.js` — generates `UploadButton` component |
| **Supported Types** | Image (4MB), PDF (4MB), Text (64KB) — 1 file per upload |
| **Auth Token** | `UPLOADTHING_TOKEN` env var on server |

### 4.2 Environment Variables

**Server** (`server/.env`):
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 7070) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Production client URL (CORS) |
| `CLIENT_URL_LOCAL` | Local dev client URL (CORS) |
| `DOMAIN` | Production server domain (cookie config) |
| `DOMAIN_LOCAL` | Local server domain |
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET_KEY` | JWT signing secret |
| `UPLOADTHING_TOKEN` | UploadThing API token |

**Client** (`client/.env`):
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Production API server URL |
| `VITE_API_URL_LOCAL` | Local dev API server URL |

### 4.3 Vite Dev Proxy

The Vite dev server proxies requests to avoid CORS during development:
- `/api/*` → Backend server (HTTP)
- `/socket.io/*` → Backend server (WebSocket upgrade enabled)

Fallback production URL: `https://chatflow-67xw.onrender.com`

### 4.4 Key NPM Dependencies

| Package | Used For |
|---------|----------|
| `axios` | All REST API calls (with cookie credentials) |
| `socket.io` / `socket.io-client` | Real-time bidirectional messaging |
| `mongoose` | MongoDB ODM (schemas, queries, population) |
| `jsonwebtoken` | JWT token creation and verification |
| `bcryptjs` | Password hashing (10 salt rounds) |
| `cookie-parser` | Parse HTTP-only auth cookies on server |
| `cors` | Cross-origin resource sharing config |
| `@mui/material` + `@emotion/*` | UI component library + CSS-in-JS |
| `lucide-react` | Modern icon library |
| `react-router-dom` | Client-side routing |
| `qrcode.react` | QR code generation for contact sharing |
| `@yudiel/react-qr-scanner` | QR code scanning (camera) |
| `uploadthing` / `@uploadthing/react` | File upload infrastructure |

---

## 5. Guardrails & Instructions for AI Agents

### ✅ DO

1. **Read this file first** before making any code changes to understand the architecture.
2. **Preserve the module system**: Use `require`/`module.exports` in `server/` (CommonJS) and `import`/`export` in `client/` (ESM).
3. **Follow the existing patterns**:
   - Controllers in `server/src/controllers/` handle business logic.
   - Routes in `server/src/routes/` define Express endpoints, applying `checkAuthentication` and `checkAuthorization` middleware.
   - Context providers in `client/src/context/` manage global state. Components consume them via `useXxx()` hooks.
4. **Use CSS custom properties** (`var(--primary)`, etc.) for all color and spacing values in new styles. Never hardcode theme-specific colors.
5. **Socket events follow the pattern**: Server handler in `socketHandler.js`, client listener in the appropriate context provider.
6. **Maintain the provider nesting order** in `main.jsx` — changing it will break dependency chains (e.g., `ChatProvider` depends on `SocketProvider` which depends on `UserProvider`).
7. **Use Mongoose populate patterns** consistently: `-password` select exclusion on User queries.
8. **Test with both** `development` and `production` `NODE_ENV` — URL resolution, cookie domain, and CORS origin all depend on it.

### ❌ DO NOT

1. **Do NOT rename the `acess_token` cookie** — it is referenced in `tokenUtils.js`, `auth.js` middleware, and must match exactly (yes, the typo is intentional/legacy).
2. **Do NOT change the provider nesting order** in `main.jsx` without understanding the dependency graph: `SnackbarProvider → ThemeProvider → UserProvider → SocketProvider → OnlineUsersProvider → ChatProvider`.
3. **Do NOT use REST endpoints to send messages** — the active message path is Socket.IO (`sendMessage2`). The REST `sendMessage` exists but is not used by the client.
4. **Do NOT delete backup files** (`ChatWindowBkp.jsx`, `ChatWindowOld.jsx`, `Settings_Bkp.jsx`) — they contain reference implementations the developer may revert to.
5. **Do NOT add dependencies** without checking if MUI or existing packages already provide the needed functionality.
6. **Do NOT modify Mongoose schemas** without considering the impact on all controllers, Socket handlers, and populate calls that reference those fields.
7. **Do NOT hardcode URLs** — always use environment variables (`VITE_API_URL`, `CLIENT_URL`, etc.) and the existing `NODE_ENV`-based resolution pattern.
8. **Do NOT store sensitive data** (tokens, passwords, API keys) anywhere other than `.env` files. These are gitignored.

### 🔧 Development Workflow

```bash
# Terminal 1 — Start the server
cd server
npm install
npm run dev          # Runs: npx nodemon src/app.js (port 7070)

# Terminal 2 — Start the client
cd client
npm install
npm run dev          # Runs: vite (port 5173)
```

### 📋 Coding Standards

- **Linter**: ESLint with flat config (client only). Rules: `no-unused-vars` with `varsIgnorePattern: ^[A-Z_]`.
- **Naming**: PascalCase for React components/files, camelCase for utilities and hooks, `*.model.js` for Mongoose schemas.
- **Error Handling Pattern** (Server): Controllers use try/catch, return JSON `{ message: "..." }` on errors with appropriate HTTP status codes.
- **Error Handling Pattern** (Client): User context differentiates 5xx (render ErrorPage), 4xx (Snackbar notification), and network errors (ErrorPage).
- **Console Logging**: Extensively used throughout for debugging. Consider structured logging for production.

### 🗺️ API Route Map (Quick Reference)

```
/api
├── /auth
│   ├── POST /register              # Public
│   ├── POST /login                  # Public
│   └── POST /logout                 # Public
├── /user
│   ├── GET /?search=keyword         # Auth required
│   ├── GET /profile                 # Auth required
│   └── PUT /profile                 # Auth + Role: user
├── /channel
│   ├── POST /                       # Auth + Role: user (create/access DM)
│   ├── GET /                        # Auth + Role: user (fetch all channels)
│   ├── POST /group                  # Auth + Role: user (create group)
│   └── DELETE /:channelId           # Auth + Role: user|admin (soft delete)
├── /message
│   ├── POST /                       # Auth + Role: user (send via REST — unused)
│   └── GET /:channelId              # Auth + Role: user (fetch messages)
└── /uploadthing                     # UploadThing SDK handler
```

### 🔌 Socket.IO Events Map

```
Client → Server:
  "setup"          userData                         Join personal room
  "new_message"    {content, channelId, sender...}  Send message (with ack callback)

Server → Client:
  "user_connected"                                  Confirms setup
  "receive_message" {newMessage, channel}            New message for channel
  "user_status_change" [userId, ...]                 Online users list update
```
