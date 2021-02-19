import React from "react";

export default (props) => {
  return (
    <div className="modal-bg">
      <div className="message-container">{props.children}
      <button className="modal-button" onClick={props.closeFunc}>
        OK
      </button>
      </div>
      
    </div>
  );
};
