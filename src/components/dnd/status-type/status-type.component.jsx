import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";

import Task from "../task/task-component";
import RetroInput from "../../retro/input/input.component";

import { createNewTask } from "../../../firebase/firebase.utils";

import "./status-type.styles.scss";

const StatusType = ({ currentSpaceId, currentStationId, status, tasks }) => {
  const [newTaskName, setNewTaskName] = useState("");
  return (
    <div className="statusType">
      <div className="st__content">
        <h3>{status.name}</h3>
        <Droppable droppableId={status.id}>
          {(provided, snapshot) => {
            const style = {
              backgroundColor: snapshot.isDraggingOver ? "skyblue" : "",
            };
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="st__taskList"
                style={style}
              >
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNewTask(
            currentSpaceId,
            currentStationId,
            status.name,
            newTaskName
          );
        }}
      >
        <div onChange={(e) => setNewTaskName(e.target.value)}>
          <RetroInput placeholder="add" />
        </div>
      </form>
    </div>
  );
};

export default StatusType;
