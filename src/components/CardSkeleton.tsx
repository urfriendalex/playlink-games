import s from "./CardSkeleton.module.scss";

export default function CardSkeleton() {
  return (
    <article className={`${s.root} card`}>
      <div className={s.thumb} />
      <div className={s.meta}>
        <div className={`${s.block} ${s.title}`} />
        <div className={`${s.block} ${s.sub}`} />
      </div>
    </article>
  );
}
