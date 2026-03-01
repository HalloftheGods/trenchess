import { ProtocolEditor } from "./components/ProtocolEditor";
export default function RulesetEditor() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/60 backdrop-blur-3xl overflow-hidden pointer-events-auto">
      <div className="flex-1 w-full h-full relative z-10 overflow-hidden text-white drop-shadow-2xl">
        <ProtocolEditor />
      </div>
    </div>
  );
}
