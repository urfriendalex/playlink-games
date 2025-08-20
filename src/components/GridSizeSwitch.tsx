import { useState } from "react";
import s from "./GridSizeSwitch.module.scss";
import cx from "clsx";

export interface GridSizeSwitchProps {
  value?: 1 | 2 | 3 | 4;
  onChange?: (cols: 1 | 2 | 3 | 4) => void;
  disabled?: boolean;
  options?: Array<1 | 2 | 3 | 4>;
}

export default function GridSizeSwitch({
  value = 3,
  onChange,
  disabled = false,
  options = [2, 3, 4],
}: GridSizeSwitchProps) {
  const [curr, setCurr] = useState<1 | 2 | 3 | 4>(value);

  function set(cols: 1 | 2 | 3 | 4) {
    if (disabled) return;
    setCurr(cols);
    onChange?.(cols);
  }

  return (
    <div className={s.root} role="group" aria-label="Grid size">
      <span className={s.label}>Grid</span>
      {options.map((n) => {
        const active = curr === n;
        return (
          <button
            key={n}
            type="button"
            className={cx(
              "focus-ring",
              s.btn,
              active && s.active,
              disabled && "opacity-60 cursor-not-allowed",
            )}
            aria-pressed={active}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            onClick={() => set(n)}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                set(n);
              }
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
