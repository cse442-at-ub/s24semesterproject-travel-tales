import React, { useState } from "react";
import "./AddPinModal.css";
import "../../App.css"
import plusButtonImage from '../../assets/plus-button.png';
import "../../App";

export default function Modal() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    //event.preventDefault();
    // Handle form submission logic here
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
            <button className="leave-arrow" onClick={toggleModal}></button>
            <div className="description"></div>
            <div className="title"></div>
            <form onSubmit={handleSubmit}>
              <input 
                className="title-box" 
                name="title" 
                value={formValues.title} 
                onChange={handleChange} 
                placeholder="Title"/>
              <input
                className="description-box" 
                name="description" 
                value={formValues.description} 
                onChange={handleChange} 
                placeholder="Description"/>
              <button className="add-pin-box" onClick={(toggleModal)}></button>              
            </form>
          </div>
        </div>
      )}
    </>
  );
}