import React, { useContext, useEffect, useState } from "react";
import Comment from "./Comment";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";

function Comments() {
  const { store } = useContext(GlobalStoreContext);

  useEffect(async () => {}, [store]);

  async function handleChange(e) {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      await store.addComment(e.target.value);
    }
  }

  return (
    <div>
      <div className="all-comments">
        {store.currentList.comments.map((comment) => (
          <Comment comment={comment} />
        ))}
      </div>
      <div className="add-comment">
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          onKeyDown={handleChange}
        />
      </div>
    </div>
  );
}

export default Comments;
