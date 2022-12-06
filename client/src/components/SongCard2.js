import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";

function SongCard2(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);
  const { song, index } = props;

  function handleClick(event) {
    store.updatePlaySong(index);
  }

  let cardClass = "list-card unselected-list-card";
  if (index === store.currentPlayIndex) {
    cardClass = "list-card selected-list-card";
  }
  return (
    <div
      key={index}
      id={"song-" + index + "-card"}
      className={cardClass}
      onClick={handleClick}
    >
      {index + 1}.{song.title} by {song.artist}
    </div>
  );
}

export default SongCard2;
