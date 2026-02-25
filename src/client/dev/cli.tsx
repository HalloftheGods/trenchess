import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel, Text } from '@/shared/components/atoms';
import { ROUTES } from '@constants/routes';

interface HistoryItem {
  id: string;
  type: "command" | "response" | "error" | "info";
  text: string;
  timestamp: string;
}

const DevCli = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init',
      type: 'info',
      text: 'Trenchess Dev CLI [Version 0.1.0]. Type "help" for commands.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const addHistory = useCallback((type: HistoryItem["type"], text: string) => {
    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 11),
        type,
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    ]);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const fullCommand = input.trim();
    addHistory("command", fullCommand);
    
    const [cmd, ...args] = fullCommand.split(" ");
    const action = cmd.toLowerCase();

    switch (action) {
      case "help":
        addHistory("info", "COMMANDS: play <style>, mmo, zen, master, clear, exit, goto <path>, status");
        break;
      case "play":
        if (args[0]) {
          navigate(ROUTES.GAME_CONSOLE.build({ style: args[0] }));
          addHistory("response", `Switching to ${args[0]} mode...`);
        } else {
          addHistory("error", "Usage: play <style> (alpha, battle, pi, chi, omega)");
        }
        break;
      case "mmo":
        navigate(ROUTES.GAME_MMO.path);
        addHistory("response", "Joining MMO...");
        break;
      case "zen":
        navigate(ROUTES.GAME_CONSOLE.build({ style: "zen" }));
        addHistory("response", "Entering Zen Garden...");
        break;
      case "master":
        navigate(ROUTES.GAME_CONSOLE.build({ style: "gamemaster" }));
        addHistory("response", "Entering Gamemaster Mode...");
        break;
      case "goto":
        if (args[0]) {
          navigate(args[0]);
          addHistory("response", `Navigating to ${args[0]}...`);
        } else {
          addHistory("error", "Usage: goto <path>");
        }
        break;
      case "status":
        addHistory("response", "All systems nominal. CLI Active.");
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        navigate(ROUTES.HOME.path);
        break;
      default:
        addHistory("error", `Unknown command: ${action}`);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 p-4 font-mono">
      <GlassPanel className="flex-1 flex flex-col overflow-hidden border-brand-blue/30 bg-black/40 shadow-[0_0_30px_rgba(0,180,255,0.1)]">
        <div className="flex justify-between items-center p-4 border-b border-brand-blue/20 bg-slate-900/50">
          <span className="text-brand-blue text-xs font-bold tracking-widest uppercase">Dev Terminal // Fullscreen</span>
          <span className="text-slate-500 text-[10px]">{new Date().toDateString()}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {history.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-600 w-16">{item.timestamp}</span>
                <Text className={`font-mono text-sm ${
                  item.type === 'command' ? 'text-brand-blue' :
                  item.type === 'error' ? 'text-red-400' :
                  item.type === 'info' ? 'text-amber-400' :
                  'text-green-400'
                }`}>
                  {item.type === 'command' ? `> ${item.text}` : item.text}
                </Text>
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleCommand} className="p-4 bg-slate-950 border-t border-brand-blue/20 flex items-center">
          <span className="mr-3 text-brand-blue font-bold">$</span>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-brand-blue placeholder-brand-blue/20 caret-brand-blue"
            placeholder="Enter command..."
          />
        </form>
      </GlassPanel>
    </div>
  );
};

export default DevCli;
