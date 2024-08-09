import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import musicIcon from "../../img/musica.png";
import getState from "../store/flux";

export const Navbar = () => {
  // const { store, actions } = useContext(Context);
  return (
    <nav className="navbar navbar-light top-nav bg-transparent mb-5">
      <Link to="/">
        <h1 className="navbar-brand mb-0 p-2 h1">
          Music Hunters{" "}
          <img className="musicIcon" src={musicIcon} alt="Music Icon" />
        </h1>
      </Link>
      <div className="ml-auto mx-1 p-1">
        <Link to="/login">
          <button
            className="btn btn-warning mx-2"
            // onClick={() => actions.funcion()}
          >
            Login
          </button>
        </Link>
        <Link to="/register/">
          <button className="btn btn-warning">Register</button>
        </Link>
      </div>
    </nav>
  );
};
