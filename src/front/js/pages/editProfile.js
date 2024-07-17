import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import { Profile } from "../component/profile";

export const editProfile = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  return (
    <>
      <NavbarUser />
      <h1 className="text-center register-header mb-3">My Profile</h1>
      {/* Poner form de editar */}
    </>
  );
};
