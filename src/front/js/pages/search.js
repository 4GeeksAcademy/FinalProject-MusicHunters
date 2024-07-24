import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Search = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      <h1 className="text-center reset-password-header mb-3">
        Search your events
      </h1>
      <form className="mx-auto">
        <div className="mb-3">
          <label htmlFor="search" className="form-label"></label>
          <input
            // onChange={inputValue}
            type="text"
            className="form-control"
            id="search"
            aria-describedby="searchlHelp"
            placeholder="Search by artist or event"
          />
        </div>

        <div className="form-buttons d-flex justify-content-between">
          <button type="submit" className="btn btn-warning">
            Search
          </button>

          <Link to="/">
            <button type="button" className="btn btn-dark">
              Back home
            </button>
          </Link>
        </div>
      </form>
    </>
  );
};
