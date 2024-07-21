import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import getState from "../store/flux";

export const Profile = () => {
  const handleClick = (id) => {
    navigate(`/editProfile/${id}`);
  };

  // const [image, setImage] = useState(null); //Para guardar imagen de usuario

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    //key={user.id}
    <li className="card p-3 d-flex flex-column align-items-center mx-auto card-user-profile">
      <input
        type="image"
        src="https://estaticos.elcolombiano.com/binrepository/780x565/0c0/0d0/none/11101/EDTW/nostalgia-musica-1_42537840_20230605193530.jpg"
        className="user-img"
      />
      {/* src del input image="ruta a la img de user en la bbdd?" */}
      <div className="flex-grow-1 text-center mt-3">
        <h3 className="mb-3">
          <i className="fas fa-thumbtack"></i>
          <span className="ms-2">
            <strong>user.name</strong>
          </span>
        </h3>
        <p className="mb-2">
          <i className="far fa-user" style={{ color: "black" }}></i>
          <span className="ms-2">Name</span>
        </p>
        <p className="mb-2">
          <i className="far fa-user" style={{ color: "black" }}></i>
          <span className="ms-2">Last Name</span>
        </p>
        <p className="mb-2">
          <i className="far fa-paper-plane" style={{ color: "black" }}></i>
          <span className="ms-2">user.email</span>
        </p>
        <p className="mb-2">
          <i className="fas fa-mobile-alt fa-lg" style={{ color: "black" }}></i>
          <span className="ms-2">user.phone</span>
        </p>
        <p className="mb-2">
          <i className="far fa-envelope" style={{ color: "black" }}></i>
          <span className="ms-2">user.address</span>
        </p>
      </div>
      <div className="edit-button-container mt-4">
        <Link to="/editProfile/:id">
          <button
            type="button"
            className="btn btn-dark"
            // onClick={() => handleClick(user.id)}
          >
            <span>Edit</span>
            <i className="fas fa-marker ms-2"></i>
          </button>
        </Link>
      </div>
    </li>
  );
};
