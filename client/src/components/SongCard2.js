import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";

function SongCard2(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);
  const { song, index } = props;

  let cardClass = "list-card unselected-list-card";
  return (
    <div key={index} id={"song-" + index + "-card"} className={cardClass}>
      {index + 1}.
      <a
        id={"song-" + index + "-link"}
        className="song-link"
        href={"https://www.youtube.com/watch?v=" + song.youTubeId}
      >
        {song.title} by {song.artist}
      </a>
    </div>
  );
}

export default SongCard2;