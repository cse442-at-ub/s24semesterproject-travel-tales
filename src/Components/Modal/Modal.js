import React, { useState } from "react";
import "./Modal.css";
import "../../App.css"
import plusButtonImage from '../../assets/plus-button.png';
import leaveArrowButton from '../../assets/leave-arrow.png';
import "../../App";

export default function Modal() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <div className="plus-icon">
        <button onClick={toggleModal}>
          <img src={plusButtonImage} alt="Plus Button" />
        </button>
      </div>
      {modal && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <div className="leave-arrow">
                <button onClick={toggleModal}>
                    <img src={leaveArrowButton} alt="leave" />
                </button>
            </div>
            <div className="modal-title-box"></div>
            <div className="modal-description-box"></div>
            <div className="add-pin-box">
                <div className="add-pin"></div>
            </div>
            <div className="description"></div>
            <div className="title"></div>
          </div>
        </div>
      )}
    </>
  );
}