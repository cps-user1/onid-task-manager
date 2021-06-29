import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import "./mini-menu.styles.scss";

import RetroInput from "../retro/input/input.component";
import RetroButton from "../retro/button/retro-button.component";
import Colors from "../colors/colors.component";

import { removeOneSpace } from "../../redux/space/space.actions";
import { useActiveSpaceData } from "../../hooks/useActiveSpaceData.hook";

/* import ExitToAppIcon from "@material-ui/icons/ExitToApp"; */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPaintRoller,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import {
  renameSpace,
  deleteSpace,
  removeMember,
  updateColorOfSpace,
} from "../../firebase/firebase.utils";

const MiniMenu = ({ setMiniMenu }) => {
  const currentUserUid = useSelector((state) => state.user.currentUser.uid);
  const dispatch = useDispatch();
  const history = useHistory();
  const activeSpaceData = useActiveSpaceData();
  const activeSpaceId = history.location.pathname.split("/")[2];
  const [rename, setRename] = useState(false);
  const [deleteSpaceStatus, setDeleteSpaceStatus] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [colorStatus, setColorStatus] = useState(false);
  const [color, setColor] = useState("");

  useEffect(() => {
    const { admin } = activeSpaceData;
    if (currentUserUid === admin) {
      setIsUserAdmin(true);
    } else {
      setIsUserAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (color !== "") {
      updateColorOfSpace(activeSpaceId, color);
      setMiniMenu(false);
    }
  }, [color]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      renameSpace(activeSpaceId, nameInput);
    } catch (error) {
      console.log(error.message);
    } finally {
      setMiniMenu(false);
    }
  };

  const handleDelete = () => {
    deleteSpace(activeSpaceId);
    dispatch(removeOneSpace(activeSpaceId));
    history.push("/");
  };

  const handleLeave = () => {
    removeMember(activeSpaceId, currentUserUid);
  };

  return (
    <div className="miniMenu">
      <ul>
        <li onClick={() => setRename(!rename)}>
          <FontAwesomeIcon icon={faEdit} />
          <p>Rename</p>
        </li>
        {rename && (
          <div className="mm__reName">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div onChange={(e) => setNameInput(e.target.value)}>
                <RetroInput type="text" placeholder="New name" />
              </div>
            </form>
          </div>
        )}
        {isUserAdmin ? (
          <>
            <li onClick={() => setDeleteSpaceStatus(!deleteSpaceStatus)}>
              {/* <DeleteIcon fontSize="small" /> */}
              <FontAwesomeIcon icon={faTrashAlt} />
              <p>Delete</p>
            </li>
            {deleteSpaceStatus && (
              <div className="mm__delete">
                <div className="mm__delete-btns">
                  <RetroButton
                    mode="gray"
                    size="small"
                    onClick={() => setMiniMenu(false)}
                  >
                    cancel
                  </RetroButton>
                  <RetroButton
                    color="danger"
                    size="small"
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </RetroButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <li onClick={() => setDeleteSpaceStatus(!deleteSpaceStatus)}>
              {/*   <ExitToAppIcon fontSize="small" /> */}
              <p>Leave</p>
            </li>
            {deleteSpaceStatus && (
              <div className="mm__delete">
                <div className="mm__delete-btns">
                  <RetroButton
                    mode="gray"
                    size="small"
                    onClick={() => setMiniMenu(false)}
                  >
                    cancel
                  </RetroButton>
                  <RetroButton
                    color="danger"
                    size="small"
                    onClick={() => handleLeave()}
                  >
                    Leave
                  </RetroButton>
                </div>
              </div>
            )}
          </>
        )}

        <li onClick={() => setColorStatus(!colorStatus)}>
          {/* <ColorLensIcon fontSize="small" /> */}
          <FontAwesomeIcon icon={faPaintRoller} />
          <p>Change color</p>
        </li>
        <div className="mm__colors">
          {colorStatus && <Colors returnColor={setColor} />}
        </div>
      </ul>
    </div>
  );
};

export default MiniMenu;
