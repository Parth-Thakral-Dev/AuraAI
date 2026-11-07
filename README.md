# AURA // Premium Cognitive Intelligence Platform

> **A minimal, high-velocity AI chatbot and SaaS platform powered by proprietary high-throughput neural architecture, stateful PostgreSQL persistence, and sub-millisecond SSE streaming.** Inspired by the visual craftsmanship of [Skiper UI](https://skiper-ui.com/).

---

## ✨ Features & Architecture

- **SaaS Design System**: Minimalist obsidian/charcoal aesthetic, subtle titanium borders, micro-interactions, responsive navigation, and Framer Motion spring physics.
- **Cognitive Neural Engine**: Native high-throughput models with runtime switching:
  - `aura-3.8-flash` (Recommended default: 1M token context, high-throughput multimodal intelligence)
  - `aura-4-pro` (Flagship: Deep mathematical and code synthesis)
  - `aura-3.5-lite` (Ultra-low latency micro-interactions)
- **Real-Time SSE Streaming**: Progressive token-by-token generation using Server-Sent Events with immediate time-to-first-token (TTFT).
- **Persistent Chat History**:
  - Full **Supabase PostgreSQL** integration with complete Row Level Security (RLS) policies.
  - Automatic fallback to **Local Persistent Storage** if Supabase credentials are not yet configured — conversations survive browser refreshes and system reboots out of the box.
- **Rich Markdown & Syntax Highlighting**:
  - Full GitHub-Flavored Markdown (tables, task lists, blockquotes, math).
  - Prism code syntax highlighting for 100+ programming languages with one-click code copy.
- **Conversation Management**:
  - Automatic 3-5 word title generation based on opening prompts.
  - Chronological grouping: *Today*, *Yesterday*, *Previous 7 Days*, *Older*.
  - Inline conversation renaming and deletion with confirmation.
  - Real-time conversation search filter.
  - Markdown export of conversations.
- **Enterprise Key Security**: All backend keys reside strictly on the server backend (`.env`). Client JavaScript bundles never touch or expose your credentials.

---

## 🚀 Quick Start

### 1. Configure Your Backend Key

Create or edit your `.env` file in the project root:

```bash
# In c:\suuuu\aura-ai\.env
AURA_API_KEY=your_backend_api_key_here
PORT=3001
```

### 2. (Optional) Configure Supabase Database

If you wish to use Supabase PostgreSQL:
1. Create a new project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in Supabase and paste the contents of `supabase-schema.sql`.
3. Add your Supabase credentials to `.env`:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

*Note: If you omit Supabase credentials, AURA automatically operates with full persistent disk storage without errors.*

### 3. Run Development Server

```bash
# Starts both the backend API and the Vite frontend
npm run dev
```

- **Frontend (Vite Dev)**: [http://localhost:5173](http://localhost:5173)
- **Backend API & Production**: [http://localhost:3001](http://localhost:3001)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
aura-ai/
├── server/
│   ├── index.ts          # Express server with SSE streaming & REST routes
│   ├── gemini.ts         # High-throughput neural engine backend adapter
│   ├── db.ts             # Supabase & persistent storage adapter
│   └── data/             # Persistent JSON database (when in local mode)
├── src/
│   ├── components/
│   │   ├── common/       # Navbar, Footer, CodeBlock, Markdown, SettingsModal
│   │   ├── landing/      # Hero, InteractiveConsole, FeaturesBento, Preview, Capabilities
│   │   └── chat/         # ChatSidebar, ChatHeader, ChatWelcome, MessageList, InputArea
│   ├── context/          # ChatContext (global multi-turn state & streaming)
│   ├── services/         # API client & SSE stream reader
│   ├── types/            # TypeScript interfaces
│   ├── pages/            # LandingPage.tsx, ChatPage.tsx
│   ├── App.tsx           # Route setup & global keyboard shortcuts (⌘K)
│   ├── main.tsx          # Application entrypoint
│   └── index.css         # Tailwind & Skiper-UI inspired styling
├── supabase-schema.sql   # PostgreSQL table definitions & RLS policies
├── .env.example          # Template environment file
├── tailwind.config.js    # Design system tokens & animations
└── package.json          # Dependencies & build scripts
```

---

## 🔒 Security & Row Level Security

- Backend proxy pattern: Client requests go to `/api/chat/stream`.
- Row Level Security: When authenticated with Supabase, users are partitioned via `auth.uid() = user_id`.
- Zero-leak architecture: Frontend bundles do not include secret keys.
