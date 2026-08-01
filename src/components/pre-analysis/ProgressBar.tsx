interface ProgressBarProps {
  percent: number;
  message?: string;
}

export function ProgressBar({ percent, message }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-selo-700/10"
      >
        <div
          className="h-full rounded-full bg-ouro-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {message && (
        <p className="mt-3 text-sm text-ink/55">{message}</p>
      )}
    </div>
  );
}
