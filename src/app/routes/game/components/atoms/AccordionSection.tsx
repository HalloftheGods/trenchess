interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
      >
        <span>{title}</span>
        <span
          className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        >
          ▶
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;
