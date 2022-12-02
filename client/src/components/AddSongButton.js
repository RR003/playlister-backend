import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";

function AddSongButton(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);
  const { song, index } = props;

  async function handleClick(event) {
    console.log("clicking + button");
    await store.addNewSong();
  }

  let cardClass = "list-card unselected-list-card";
  return (
    <div
      key={index}
      id={"song-" + index + "-card"}
      className={cardClass}
      onClick={handleClick}
    >
      +
    </div>
  );
}

export default AddSongButton;
