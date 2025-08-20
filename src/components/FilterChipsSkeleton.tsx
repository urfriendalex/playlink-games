import s from "./FilterChipsSkeleton.module.scss";

export default function FilterChipsSkeleton() {
  return (
    <div className={s.toolbar} aria-hidden>
      <div className={s.labelSkeleton} />
      <div className={`${s.chipSkeleton} ${s.w60}`} />
      <div className={`${s.chipSkeleton} ${s.w80}`} />
      <div className={`${s.chipSkeleton} ${s.w100}`} />
      <div className={`${s.chipSkeleton} ${s.w120}`} />
    </div>
  );
}
