import { Link, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import userIcon from "../../img/user.png";
import musicIcon from "../../img/musica.png";
import favIcon from "../../img/favourites.png";
import logOutIcon from "../../img/logout.png";
import getState from "../store/flux";
import { Context } from "../store/appContext";

export const NavbarUser = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleAddContact = async (events) => {
    event.preventDefault();
    await actions.events(events);
    navigate("/search");
  };

  const logOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const userFavourites = () => {
    if (store.getFavourites() == true) {
      navigate("/favourites");
    }
  };
  return (
    <nav className="navbar navbar-light top-nav bg-transparent mb-5">
      <Link to="/homeUser">
        <h1 className="navbar-brand mb-0 p-2 h1">
          Music Hunters{" "}
          <img className="musicIcon" src={musicIcon} alt="Music Icon" />
        </h1>
      </Link>
      <div className="ml-auto d-flex">
        <Link to="/userProfile">
          <button
            className="btn btn-warning p-2 d-flex align-items-center justify-content-center"
            onClick={() => actions.getUserDataFromToken(store.user.id)}
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
              onClick={() => userFavourites()}
              src={favIcon}
              alt="Fav Icon"
              style={{ width: "24px", height: "24px" }}
            />
          </button>
        </Link>

        <form
          className="d-flex form-search-bar"
          role="search"
          onSubmit={handleAddContact}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search by artist, genere or location"
            aria-label="Search"
          />
          <button className="btn btn-warning me-2" type="submit">
            Search
          </button>
        </form>
        {/* <Link to="/"> */}
        <button
          className="btn btn-warning p-2 me-2 d-flex align-items-center justify-content-center"
          onClick={() => logOut()}
        >
          <img
            className="logOutIcon"
            src={logOutIcon}
            alt="LogOut Icon"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
        {/* </Link> */}
      </div>
    </nav>
  );
};
