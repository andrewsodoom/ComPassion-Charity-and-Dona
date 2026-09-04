import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';

const buildAnswer = (question) => {
  const q = question.toLowerCase();

  if (q.includes('donate') || q.includes('payment') || q.includes('give')) {
    return 'Open Campaigns, choose a cause, and select Donate. Enter the amount and donor details, then continue through the payment step. After the donation is completed, you can view the confirmation and receipt.';
  }

  if (q.includes('receipt') || q.includes('donation history') || q.includes('past donation')) {
    return 'Sign in and open your Donor Dashboard. My Impact & Receipts shows your donation history. Select a donation to view its receipt, or open the receipt page from a donation confirmation.';
  }

  if (q.includes('campaign') || q.includes('cause') || q.includes('find')) {
    return 'Select Campaigns in the navigation to browse causes. Use the search and filters to narrow the list, then select a campaign to read its story, updates, progress, and volunteer opportunities.';
  }

  if (q.includes('volunteer') || q.includes('opportunit') || q.includes('apply')) {
    return 'Open Volunteers to browse available opportunities, or open a campaign and view its Volunteers section. Choose an opportunity, select Apply, complete the form, and submit your application. Sign in first if prompted.';
  }

  if (q.includes('login') || q.includes('sign in') || q.includes('register') || q.includes('sign up') || q.includes('account')) {
    return 'Select Sign In to access your account, or choose Register to create one. Use Forgot password on the sign-in page if you cannot remember your password. Your dashboard will show the options available for your role.';
  }

  if (q.includes('charity') || q.includes('organization') || q.includes('create a campaign')) {
    return 'After signing in with a charity account, open the Charity Dashboard. Use Create Campaign to add your cause, then complete the campaign details and submit it. You can manage campaigns, post updates, and review volunteer applications from the dashboard.';
  }

  if (q.includes('admin') || q.includes('verify')) {
    return 'Administrators can sign in and open the Admin Dashboard to review charities, verification requests, campaigns, and platform activity.';
  }

  if (q.includes('home') || q.includes('about') || q.includes('contact') || q.includes('navigate') || q.includes('where')) {
    return 'Use the top navigation to visit Home, Campaigns, Volunteers, or About. Home highlights causes and actions, Campaigns lists fundraisers, Volunteers lists opportunities, and About explains the platform.';
  }

  return 'I can help you use the website. Ask how to find a campaign, make a donation, view a receipt, apply to volunteer, create an account, or use a dashboard.';
};

const ProjectGuideBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I can help you use the website. Ask me how to find a cause, donate, view a receipt, or volunteer.'
    }
  ]);

  const quickPrompts = useMemo(() => [
    'How do I find a campaign?',
    'How do I make a donation?',
    'Where can I find my receipt?',
    'How do I apply to volunteer?'
  ], []);

  const handleSend = (question = input) => {
    const trimmed = question.trim();
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
                  onClick={() => handleSend(prompt)}
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
