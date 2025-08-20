import s from "./GameCard.module.scss";
import type { Game } from "@/hooks/useGames";
import { useGameState } from "@/context/GameContext";
import cx from "clsx";

export default function GameCard({ game }: { game: Game }) {
  const { state, dispatch } = useGameState();
  const fav = !!state.favorites[game.id];

  return (
    <article className={cx("card card--hoverlift", s.card)}>
      <div className={s.thumbWrap}>
        <img className={s.thumb} src={game.thumbnail} alt="" loading="lazy" />
        {game.isNew && <span className={s.badge}>New</span>}
        <button
          aria-pressed={fav}
          className={cx("btn focus-ring", s.favBtn)}
          onClick={() => dispatch({ type: "TOGGLE_FAVORITE", payload: game.id })}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>
      <div className={s.meta}>
        <div className={s.title}>{game.title}</div>
        <div className={s.sub}>{game.provider.name} • {game.type}</div>
      </div>
    </article>
  );
}
