import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";

function SongCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);
  const { song, index } = props;

  function handleDragStart(event) {
    event.dataTransfer.setData("song", index);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDraggedTo(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggedTo(false);
  }

  async function handleDrop(event) {
    event.preventDefault();
    let target = event.target;
    let targetId = target.id;
    targetId = targetId.substring(target.id.indexOf("-") + 1);
    let sourceId = event.dataTransfer.getData("song");
    sourceId = sourceId.substring(sourceId.indexOf("-") + 1);

    setDraggedTo(false);

    // ASK THE MODEL TO MOVE THE DATA
    let index1 = parseInt(targetId.substring(0, 1));
    let index2 = parseInt(sourceId.substring(0, 1));

    // UPDATE THE LIST
    await store.addMoveSongTransaction(index2, index1);
  }
  function handleRemoveSong(event) {
    console.log("remove song?");
    store.showRemoveSongModal(index, song);
  }
  function handleClick(event) {
    // DOUBLE CLICK IS FOR SONG EDITING
    if (event.detail === 2) {
      console.log("double click");
      store.showEditSongModal(index, song);
    }
  }

  let cardClass = "list-card unselected-list-card";
  return (
    <div
      key={index}
      id={"song-" + index + "-card"}
      className={cardClass}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable="true"
      onClick={handleClick}
    >
      {index + 1}.
      <a
        id={"song-" + index + "-link"}
        className="song-link"
        href={"https://www.youtube.com/watch?v=" + song.youTubeId}
      >
        {song.title} by {song.artist}
      </a>
      <input
        type="button"
        id={"remove-song-" + index}
        className="list-card-button"
        value={"\u2715"}
        onClick={handleRemoveSong}
      />
    </div>
  );
}

export default SongCard;
