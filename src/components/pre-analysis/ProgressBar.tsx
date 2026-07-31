interface ProgressBarProps {
  percent: number;
  stepLabel: string;
}

export function ProgressBar({ percent, stepLabel }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-selo-700/10">
        <div
          className="h-full rounded-full bg-ouro-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink/50">
        {stepLabel}
      </p>
    </div>
  );
}
