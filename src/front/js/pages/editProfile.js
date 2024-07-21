import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import { Profile } from "../component/profile";

export const EditProfile = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();
  const inputValue = (e) => {
    const { name, value } = e.target;
    setDataContact((prevDataContact) => ({
      ...prevDataContact,
      [name]: value,
    }));
  };
  const [dataContact, setDataContact] = useState({
    userName: "",
    emailAdress: "",
    password: "",
    confirmPassword: "",
  });

  const handleAddContact = (event) => {
    event.preventDefault();

    actions.register(
      dataContact.userName,
      dataContact.emailAdress,
      dataContact.password,
      dataContact.confirmPassword
    );
    setDataContact({
      userName: "",
      name: "",
      lastName: "",
      emailAdress: "",
      phoneNumber: "",
      adress: "",
    });
  };
  const [image, setImage] = useState(null); //Para guardar imagen de usuario

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <NavbarUser />
      <h1 className="text-center register-header mb-3">Edit Profile</h1>
      {/* Poner form de editar */}
      <form className="mx-auto" onSubmit={handleAddContact}>
        <div className="file-input-container mb-3 mt-3">
          <input
            type="file"
            className="user-img-input"
            // onClick={handleImageChange}
            // style={{ display: "none" }} // Oculta el input de archivo
          />

          {image && (
            <img src={image} alt="User Profile" className="user-img-preview" />
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            User Name
          </label>
          <input
            onChange={inputValue}
            type="text"
            className="form-control mb-3"
            id="userName"
            name="userName"
            aria-describedby="userName"
            placeholder="Enter a new user name"
            value={dataContact.userName}
          />

          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            onChange={inputValue}
            type="text"
            className="form-control mb-3"
            id="name"
            name="name"
            aria-describedby="name"
            placeholder="Enter your name"
            value={dataContact.name}
          />

          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            onChange={inputValue}
            type="text"
            className="form-control mb-3"
            id="lastName"
            name="lastName"
            aria-describedby="lastName"
            placeholder="Enter your last name"
            value={dataContact.lastName}
          />

          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            onChange={inputValue}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="emailAdress"
            aria-describedby="emailHelp"
            placeholder="example@email.com"
            value={dataContact.emailAdress}
          />

          <div id="emailHelp" className="form-text">
            You'll must check your inbox to confirm your new email.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="phone-number" className="form-label">
            Phone number
          </label>
          <input
            onChange={inputValue}
            type="tel"
            className="form-control"
            id="phone-number"
            name="phone-number"
            placeholder="612345678"
            value={dataContact.phone}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="adress" className="form-label">
            Adress
          </label>
          <input
            onChange={inputValue}
            type="text"
            className="form-control"
            id="adress"
            name="adress"
            placeholder="Main St 123"
            value={dataContact.adress}
          />
        </div>

        <div className="form-buttons d-flex justify-content-between">
          {/* <Link to="/homeUser/:id"> */}
          <button
            type="submit"
            className="btn btn-warning"
            // onClick={() => actions.register()}
          >
            Update
          </button>
          {/* </Link> */}
          <Link to="/userProfile/:id">
            <button type="button" className="btn btn-dark">
              Back
            </button>
          </Link>
        </div>
      </form>
    </>
  );
};
