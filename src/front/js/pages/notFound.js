import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import errorIcon from "../../img/notfound.png";

export const NotFound = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  return (
    <>
      <Navbar />
      <h1 className="mx-5 ms-auto mb-5 not-found">
        An error has ocurred, page not found!
      </h1>
      <div className="d-flex justify-content-center">
        <img className="errorIcon" src={errorIcon} alt="Error Icon" />
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Link to="/">
          <button type="button" className="btn btn-dark button-error-view">
            Back home
          </button>
        </Link>
      </div>
    </>
  );
};
