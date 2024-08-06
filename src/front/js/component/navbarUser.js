import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "../../img/user.png";
import musicIcon from "../../img/musica.png";
import favIcon from "../../img/favourites.png";
import logOutIcon from "../../img/logout.png";
import { Context } from "../store/appContext";

export const NavbarUser = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // estado para searchbar

  const handleSearch = (event) => {
    event.preventDefault();
    actions.searchEvents(searchQuery); // Busco eventos
    navigate("/search");
    console.log(searchQuery);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const getFavourites = () => {
    if (store.getFavourites === true) {
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
          <button
            className="btn btn-warning mx-2 p-2 d-flex align-items-center justify-content-center"
            onClick={getFavourites}
          >
            <img
              className="favIcon"
              src={favIcon}
              alt="Fav Icon"
              style={{ width: "24px", height: "24px" }}
            />
          </button>
        </Link>

        <form
          className="d-flex form-search-bar"
          role="search"
          onSubmit={(event) => handleSearch(event)}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search by artist, genere or location"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-warning me-2" type="submit">
            Search
          </button>
        </form>

        <button
          className="btn btn-warning p-2 me-2 d-flex align-items-center justify-content-center"
          onClick={logOut}
        >
          <img
            className="logOutIcon"
            src={logOutIcon}
            alt="LogOut Icon"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>
    </nav>
  );
};
