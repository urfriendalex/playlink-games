import s from "./GameCard.module.scss";
import type { Game } from "@/hooks/useGames";
import { useGameState } from "@/context/GameContext";
import cx from "clsx";
import { useState } from "react";

export default function GameCard({ game }: { game: Game }) {
  const { state, dispatch } = useGameState();
  const fav = !!state.favorites[game.id];
  const [pop, setPop] = useState(false);
  const [imgError, setImgError] = useState(false);

  function onToggleFavorite() {
    setPop(true);
    dispatch({ type: "TOGGLE_FAVORITE", payload: game.id });
    window.setTimeout(() => setPop(false), 220);
  }

  const src = imgError ? "/placeholders/game-thumb.svg" : game.thumbnail;
  const imgClass = cx(s.thumb, imgError && s.placeholder);

  return (
    <article className={cx("card", s.card)}>
      <div className={s.thumbWrap}>
        <img
          className={imgClass}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImgError(true)}
        />
        {game.isNew && <span className={s.badge}>New</span>}
        <button
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className={cx("btn focus-ring", s.favBtn)}
          data-pop={pop ? "true" : undefined}
          onClick={onToggleFavorite}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>
      <div className={s.meta}>
        <div className={s.title}>{game.title}</div>
        <div className={s.sub}>
          {game.provider.logo && (
            <img className={s.providerLogo} src={game.provider.logo} alt="" aria-hidden="true" />
          )}
          <span>{game.provider.name}</span>
          <span>•</span>
          <span>{game.type}</span>
        </div>
      </div>
    </article>
  );
}
