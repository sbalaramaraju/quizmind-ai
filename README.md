
# 🧠 QuizMind AI

QuizMind AI is a high-performance, real-time multiplayer quiz platform powered by **Google Gemini AI**. This edition is built for high-concurrency and horizontal scalability using **Redis** as a distributed state store.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- **AI Quiz Generation**: Leveraging Google Gemini 3 to create unique, high-quality questions on any topic instantly.
- **Stateless Backend**: Every request fetches state from Redis, allowing the app to scale horizontally across multiple server nodes.
- **Real-Time Multiplayer**: Synchronized gameplay using Socket.io with a Redis Pub/Sub adapter for cross-server communication.
- **Optimized Leaderboards**: Uses **Redis Sorted Sets (ZSET)** for $O(\log N)$ ranking performance.
- **Sleek UI/UX**: Modern "Glassmorphism" design with smooth animations and responsive layouts.
- **Auto-Cleanup**: Temporary rooms and data are automatically purged 30 minutes after completion using Redis TTL.


## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (to run Redis)
- A **Google Gemini API Key** (Get one at [ai.google.dev](https://ai.google.dev/))

### 1. Start Infrastructure (Redis)
In the project root, run:
```bash
docker-compose up -d
```
> Skip this step and use your cloud Redis URL in `REDIS_URL` if you are using a managed Redis provider (e.g., Upstash).


### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
API_KEY=your_gemini_api_key_here
REDIS_URL=redis://localhost:6379  # or use your Upstash Redis URL
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Socket.io-client.
- **Backend**: Node.js, Express, TypeScript, Socket.io.
- **State/PubSub**: Redis (using `ioredis` and `@socket.io/redis-adapter`).
- **AI Engine**: Google Generative AI (Gemini 3 Flash).

---

## 📂 Project Structure

```text
quizmind-ai/
├── docker-compose.yml  # Redis infrastructure setup
├── backend/            # Express & Socket.io Server (Stateless)
│   ├── gemini.ts       # AI Integration logic
│   ├── index.ts        # Server entry & Distributed Timer logic
│   └── types.ts        # Shared interfaces
└── frontend/           # React Application
    ├── src/            # Application source
    ├── types.ts        # Shared interfaces
    └── socket.ts       # Client socket configuration
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
