import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import getState from "../store/flux";

export const Search = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      <NavbarUser />
      <h1 className="text-center reset-password-header mb-3">
        Search your events
      </h1>
      <div className="container">
        <ul className="list-unstyled">
          {store.events === undefined ? (
            <p className="text-center fs-3">There's no events to show</p>
          ) : (
            store.events.map((event) => (
              <li
                key={event.id}
                className="card p-3 d-flex flex-row align-items-center"
              >
                <div className="card mb-3" style={{ maxWidth: "540px" }}>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src="..."
                        className="img-fluid rounded-start"
                        alt="..."
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                          This is a wider card with supporting text below as a
                          natural lead-in to additional content. This content is
                          a little bit longer.
                        </p>
                        <p className="card-text">
                          <small className="text-body-secondary">
                            Last updated 3 mins ago
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="form-buttons d-flex justify-content-between">
          <Link to={"/favourites"}>
            <button type="button" className="btn btn-warning">
              Favourites
            </button>
          </Link>

          <Link to="/homeUser">
            <button type="button" className="btn btn-dark">
              Back home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
