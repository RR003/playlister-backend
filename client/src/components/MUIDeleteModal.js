import { useContext } from "react";
import GlobalStoreContext from "../store";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MUIDeleteModal() {
  const { store } = useContext(GlobalStoreContext);
  let name = "";
  if (store.listMarkedForDeletion) {
    name = store.listMarkedForDeletion.name;
  }
  async function handleDeleteList(event) {
    await store.deleteMarkedList();
    await store.loadIdNamePairs();
  }
  function handleCloseModal(event) {
    store.unmarkListForDeletion();
  }

  return (
    <Modal open={store.listMarkedForDeletion !== null}>
      <Box sx={style}>
        <div className="modal-dialog">
          <header className="dialog-header">
            Delete {name} from Playlister?
          </header>
          <div id="confirm-cancel-container">
            <Button
              id="dialog-yes-button"
              className="modal-button"
              onClick={handleDeleteList}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
            <Button
              id="dialog-no-button"
              className="modal-button"
              onClick={handleCloseModal}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
          </div>
        </div>
        {!store.listMarkedForDeletion && <div></div>}
      </Box>
    </Modal>
  );
}
