import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import getState from "../store/flux";

export const Profile = () => {
  const handleClick = (id) => {
    navigate(`/editProfile/${id}`);
  };

  return (
    <li
      //key={user.id}
      className="card p-3 d-flex flex-row align-items-center mx-auto card-user-profile"
    >
      <div className="me-3 ">
        <i className="fas fa-user"></i>
      </div>
      <div className="flex-grow-1 mx-auto">
        <h3 className="mb-1 ml-2">
          <i className="fas fa-thumbtack"></i>
          <span className="ms-2">{/* <strong>{user.name}</strong> */}</span>
        </h3>
        <p className="mb-1">
          <i className="far fa-paper-plane" style={{ color: "black" }}></i>
          {/* <span className="ms-2">{user.email}</span> */}
        </p>
        <p className="mb-1">
          <i className="fas fa-mobile-alt fa-lg" style={{ color: "black" }}></i>
          {/* <span className="ms-2">{user.phone}</span> */}
        </p>
        <p className="mb-0">
          <i className="far fa-envelope" style={{ color: "black" }}></i>
          {/* <span className="ms-2">{user.address}</span> */}
        </p>
      </div>
      <div className="ms-5 mx-3 d-flex gap-2">
        <Link to="/userProfile">
          {/* // {`/userProfile/}${user.id}`}> */}
          <button
            type="button"
            className="btn btn-dark"
            // onClick={() => handleClick(user.id)}
          >
            <i className="fas fa-marker"></i>
          </button>
        </Link>
      </div>
    </li>
  );
};
