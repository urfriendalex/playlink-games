import { useMemo } from "react";
import s from "./CardSkeleton.module.scss";

function pickRandomWidthClass(): string {
  const widths = [s.w30, s.w40, s.w50, s.w60, s.w70, s.w80, s.w90];
  return widths[Math.floor(Math.random() * widths.length)];
}

export default function CardSkeleton() {
  const randomTitleWidth = useMemo(() => pickRandomWidthClass(), []);
  return (
    <article className={`${s.root} card`}>
      <div className={s.thumb} />
      <div className={s.meta}>
        <div className={`${s.block} ${s.title} ${randomTitleWidth}`} />
        <div className={`${s.block} ${s.sub}`} />
      </div>
    </article>
  );
}
