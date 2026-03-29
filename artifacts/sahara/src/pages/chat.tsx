import { useState, useRef, useEffect } from "react";
import { useSendChatMessage, useGetChatHistory } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useGetChatHistory(getAuthOptions());
  
  const { mutate: sendMessage, isPending } = useSendChatMessage({
    ...getAuthOptions(),
    mutation: {
      onSuccess: () => {
        setInput("");
        queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
      }
    }
  });

  const messages = history?.messages || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    sendMessage({ data: { message: input } });
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col glass-card rounded-[2rem] overflow-hidden border-2 border-white/80 shadow-xl">
        {/* Header */}
        <div className="p-4 px-6 bg-white/90 border-b border-slate-100 flex items-center gap-4 z-10 shadow-sm">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-primary rounded-xl flex items-center justify-center text-white shadow-md">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold font-display text-lg text-slate-800">Sahara AI Mentor</h2>
            <p className="text-xs font-semibold text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online & ready
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 gap-2 font-medium">
              <Loader2 className="animate-spin" size={20} /> Loading history...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-6">
                <Sparkles size={40} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">Hello there!</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                I'm your career and wellness mentor. Ask me about your career path, how to handle stress, or what to learn next.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-slate-800 text-white" : "bg-gradient-to-tr from-indigo-500 to-primary text-white"
                )}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl font-medium text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-slate-800 text-white rounded-tr-sm" 
                    : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isPending && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={16} /> Thinking...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-6 pr-14 py-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isPending}
              className="absolute right-2 p-2.5 bg-primary text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={18} className="translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
