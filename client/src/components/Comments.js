import React, { useContext, useEffect, useState } from "react";
import Comment from "./Comment";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import TextField from "@mui/material/TextField";

function Comments() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

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
      {auth.user !== null && store.currentList.published && (
        <div className="add-comment">
          <TextField
            id="outlined-basic"
            label="Add a Comment"
            variant="outlined"
            onKeyDown={handleChange}
            style={{ width: "50vh", marginTop: "20px" }}
          />
        </div>
      )}
      {auth.user !== null && !store.currentList.published && (
        <div className="add-comment">
          <p>Publish your playlist so users can view</p>
        </div>
      )}
    </div>
  );
}

export default Comments;
