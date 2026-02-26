import React, { useState, useEffect } from 'react';
import { GlassPanel, Text } from '@/shared/components/atoms';
import { useTerminal } from '@/shared/context/TerminalContext';
import type { GameStateHook } from '@/shared/types';

interface DevCliProps {
  game: GameStateHook;
}

const DevCli: React.FC<DevCliProps> = ({ game }) => {
  const { history, addLog } = useTerminal();
  const [input, setInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    game.dispatch(input.trim());
    setInput('');
  };

  // Welcome message if history is empty
  useEffect(() => {
    if (history.length === 0) {
      addLog('info', 'Trenchess Dev CLI [Version 0.1.0]. Type "help" for commands.');
    }
  }, [addLog, history.length]);

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
                  item.type === 'game' ? 'text-teal-400' :
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
