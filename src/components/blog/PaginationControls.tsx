interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const PaginationControls = ({ current, total, onChange }: Props) => {
  return (
    <div className="flex justify-center items-center gap-3 text-slate-200">
      <button
        className="px-3 py-2 rounded-lg bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        Prev
      </button>
      <span className="text-sm">Page {current} of {total}</span>
      <button
        className="px-3 py-2 rounded-lg bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
