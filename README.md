🤖 Perplexity Search Agent

A modern AI Agent web application built with Next.js 16, React 19, LangChain, OpenAI, and Perplexity Search, featuring a clean ChatGPT-style interface and tool-based reasoning.

✨ Features

🚀 Next.js 16 (App Router)

⚛️ React 19

🧠 LangChain OpenAI Functions Agent

🔍 Perplexity Search API integration

💬 Real-time chat UI with typing indicator

🎨 Tailwind CSS v4 styling

📱 Fully responsive design

🛠️ Easy to extend with memory, streaming, and DB support

🧱 Tech Stack
Layer Tech
Frontend Next.js 16, React 19
Styling Tailwind CSS v4
Backend Next.js API Routes
Agent LangChain Classic
LLM OpenAI (gpt-4o-mini)
Search Perplexity API
Icons lucide-react
Validation zod
📁 Project Structure
app/
├── api/
│ └── agent/
│ └── route.ts # LangChain Agent API
├── page.tsx # Main page
└── components/
└── AIAgentUI.tsx # Chat UI component

libs/
└── perplexity/
└── index.ts # Perplexity search helper

🔐 Environment Variables

Create a .env.local file in the project root:

OPENAI_API_KEY=your_openai_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key

⚠️ Never expose API keys in client-side code.
These are used only in server routes.

🚀 Getting Started
1️⃣ Install dependencies
npm install

2️⃣ Run the development server
npm run dev

Open in your browser:

👉 http://localhost:3000

🔌 API Reference
POST /api/agent
Request Body
{
"input": "Explain quantum computing in simple terms"
}

Response
{
"success": true,
"output": "Quantum computing is..."
}

🧠 How the Agent Works

User sends a message from the UI

Frontend calls /api/agent

LangChain OpenAI Functions Agent processes the input

Agent invokes Perplexity Search tool when required

Final response is returned and displayed in the UI

❗ Important Notes

❌ The agent cannot access OpenAI billing or credits

✅ Tool usage is decided automatically by the agent

⚡ Next.js API routes handle all secure logic

🛠️ Scripts
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint

🔮 Future Enhancements

🔄 Streaming responses (SSE)

🧠 Conversation memory

💾 Persistent chat history (MongoDB / Prisma)

📝 Markdown & syntax highlighting

👥 Multi-chat sessions

🔐 Authentication (Clerk / NextAuth)

📜 License

MIT License — free to use and modify.

🙌 Author

Built with ❤️ using Next.js 16, LangChain, and Perplexity AI

If you want, I can:

Add Vercel deployment steps

Create a Dockerfile

Add screenshots section

Convert this into monorepo-ready
