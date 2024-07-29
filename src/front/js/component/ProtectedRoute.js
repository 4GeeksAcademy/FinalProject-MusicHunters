import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Outlet, Navigate } from "react-router-dom";
import { NavbarUser } from "../component/navbarUser";
import Swal from "sweetalert2";

export const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { store, actions } = useContext(Context);
  const isAuthenticated = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return token !== null;
  };

  const canActivate = isAuthenticated();

  if (!canActivate) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
};
