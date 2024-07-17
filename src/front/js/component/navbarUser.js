import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import userIcon from "../../img/user.png";
import musicIcon from "../../img/musica.png";
import favIcon from "../../img/favourites.png";
import getState from "../store/flux";

export const NavbarUser = () => {
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
        <Link to="/userProfile/:id">
          <button
            className="btn btn-warning mx-2"
            // onClick={() => actions.funcion()}
          >
            <img className="userIcon" src={userIcon} alt="User Icon" />
          </button>
        </Link>
        <Link to="/favourites/:id">
          <button className="btn btn-warning">
            <img className="favIcon" src={favIcon} alt="Fav Icon" />
          </button>
        </Link>
      </div>
    </nav>
  );
};
