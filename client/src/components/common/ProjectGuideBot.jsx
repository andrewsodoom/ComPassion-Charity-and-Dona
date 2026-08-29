import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';

const buildAnswer = (question) => {
  const q = question.toLowerCase();

  if (q.includes('login') || q.includes('sign in') || q.includes('account')) {
    return 'The app uses a JWT-based auth flow. When a user signs up or logs in, the frontend sends their email and password to the backend. The backend checks the user record, creates a token, and sends it back. After that, the browser stores the token and includes it in later requests.';
  }

  if (q.includes('donor')) {
    return 'A donor can browse verified campaigns, donate to causes, and receive receipts. The donation flow usually creates a payment simulation, updates the campaign total, and records the donation in the database.';
  }

  if (q.includes('charity') || q.includes('organization')) {
    return 'A charity can create and manage campaigns, publish updates, and request verification. The admin reviews documents and can mark the organization as verified before the charity gets trust badges and promotion.';
  }

  if (q.includes('volunteer')) {
    return 'A volunteer can browse opportunities, apply for shifts, and track service activities. The app supports role-based views so each user sees the features relevant to them.';
  }

  if (q.includes('campaign')) {
    return 'Campaigns are the main fundraising items. Each campaign has a title, description, goal, target amount, category, location, and organization details. The frontend fetches them from /api/campaigns and shows them in cards and filters.';
  }

  if (q.includes('donate') || q.includes('payment') || q.includes('receipt')) {
    return 'Donation actions start from a campaign card. The user chooses an amount, the app simulates payment processing, and the backend updates the campaign raised value. A receipt is then generated for a donor to view or download.';
  }

  if (q.includes('mongo') || q.includes('database') || q.includes('atlas')) {
    return 'This project stores main data in MongoDB Atlas. The backend connects in the server config, then reads and writes users, campaigns, donations, updates, and volunteer records through Mongo collections. The app is designed so the frontend never talks directly to MongoDB.';
  }

  if (q.includes('how this app works') || q.includes('system') || q.includes('flow')) {
    return 'Think of it as three layers: frontend, backend API, and database. The React app displays pages and dashboards, the Express server handles requests, and MongoDB stores the real data. The browser sends requests to /api, and the server returns JSON responses.';
  }

  if (q.includes('frontend') || q.includes('client')) {
    return 'The client lives in the /client folder. It contains pages, components, and service files that call the backend API. It is what users see in the browser.';
  }

  if (q.includes('backend') || q.includes('server')) {
    return 'The backend lives in the /server folder. It runs Express, handles auth, processes campaign and donation logic, and talks to MongoDB Atlas.';
  }

  if (q.includes('where') || q.includes('start') || q.includes('begin')) {
    return 'Start in the frontend route /campaigns, then follow the auth flow in /login and /register. For a deeper understanding, check the server controllers for campaign, donation, and auth logic.';
  }

  if (q.includes('admin')) {
    return 'The admin role can verify charities, review submissions, and review platform analytics. The admin dashboard surfaces statistics about campaigns, users, and verification status.';
  }

  return 'I can explain the project in simple terms: ask about login, campaigns, donations, MongoDB, roles, or how the app works as a whole. I can also help you navigate the code flow.';
};

const ProjectGuideBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I can explain how this charity app works. Ask me about login, campaigns, donations, MongoDB, or user roles.'
    }
  ]);

  const quickPrompts = useMemo(() => [
    'How does the app work?',
    'What is the login flow?',
    'How do campaigns work?',
    'How does MongoDB fit in?'
  ], []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: 'user', text: trimmed };
    const botMessage = { sender: 'bot', text: buildAnswer(trimmed) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-600 px-4 py-3 text-white dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Project Guide</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/10"
              aria-label="Close guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[340px] space-y-3 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'ml-auto bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSend();
                }}
                placeholder="Ask about the app..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 p-2 text-white hover:bg-emerald-700"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" />
          Ask the guide
        </button>
      )}
    </div>
  );
};

export default ProjectGuideBot;
