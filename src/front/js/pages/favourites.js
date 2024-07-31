import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import Swal from "sweetalert2";

export const Favourites = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  return (
    <>
      <NavbarUser />
      <h1 className="text-center register-header mb-3">My Favourites</h1>
      {/* {store.favourites === undefined ? (
        <p className="text-center fs-3">There's no favourites to show</p>
      ) : (
        store.favourite.map((fav) => (
          <div
            className="card mb-5 mx-auto cards-events"
            key={fav.id}
            style={{ maxWidth: "540px" }}
          >
            {fav.id}
          </div>
        ))
      )} */}
    </>
  );
};
