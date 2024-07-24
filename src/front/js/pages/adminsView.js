import { NavbarUser } from "../component/navbarUser";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import userIcon from "../../img/user.png";
import musicIcon from "../../img/musica.png";
import favIcon from "../../img/favourites.png";
import logOutIcon from "../../img/logout.png";
import getState from "../store/flux";

export const AdminsView = () => {
  return (
    <>
      <NavbarUser />
      <h1 className="text-center register-header mb-3">Admins view</h1>
    </>
  );
};
