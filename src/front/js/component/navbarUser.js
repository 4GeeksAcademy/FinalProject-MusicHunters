import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import userIcon from "../../img/user.png";
import musicIcon from "../../img/musica.png";
import favIcon from "../../img/favourites.png";
import logOutIcon from "../../img/logout.png";
import getState from "../store/flux";
import { Context } from "../store/appContext";

export const NavbarUser = () => {
  const { store, actions } = useContext(Context);
  return (
    <nav className="navbar navbar-light top-nav bg-transparent mb-5">
      <Link to="/homeUser">
        <h1 className="navbar-brand mb-0 p-2 h1">
          Music Hunters{" "}
          <img className="musicIcon" src={musicIcon} alt="Music Icon" />
        </h1>
      </Link>
      <div className="ml-auto d-flex align-items-center">
        <Link to="/userProfile">
          <button
            className="btn btn-warning mx-2 p-2 d-flex align-items-center justify-content-center"
            onClick={() => actions.getUser(store.user.id)}
          >
            <img
              className="userIcon"
              src={userIcon}
              alt="User Icon"
              style={{ width: "24px", height: "24px" }}
            />
          </button>
        </Link>
        <Link to="/favourites">
          <button className="btn btn-warning mx-2 p-2 d-flex align-items-center justify-content-center">
            <img
              className="favIcon"
              src={favIcon}
              alt="Fav Icon"
              style={{ width: "24px", height: "24px" }}
            />
          </button>
        </Link>
        <Link to="/">
          <button
            className="btn btn-warning mx-2 p-2 d-flex align-items-center justify-content-center"
            // onClick={localStorage.removeItem("token")}
          >
            <img
              className="logOutIcon"
              src={logOutIcon}
              alt="LogOut Icon"
              style={{ width: "24px", height: "24px" }}
            />
          </button>
        </Link>
      </div>
    </nav>
  );
};
