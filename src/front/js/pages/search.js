import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import getState from "../store/flux";
import favIcon from "../../img/favourites.png";

export const Search = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      <NavbarUser />
      <h1 className="text-center reset-password-header mb-5">
        Search your events
      </h1>
      <div className="container">
        <ul className="list-unstyled">
          {store.events === undefined ? (
            <p className="text-center fs-3">There's no events to show</p>
          ) : (
            store.events.map((event) => (
              // <li
              //   key={event.id}
              //   className="card p-3 d-flex flex-row align-items-center"
              // >
              <div
                className="card mb-5 mx-auto cards-events"
                key={event.id}
                style={{ maxWidth: "540px" }}
              >
                <div className="row g-0 p-2 event-card">
                  <div className="col-md-4">
                    <img
                      src={event.image_url}
                      className="img-fluid rounded-start"
                      alt={event.name}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h3 className="card-events-title">
                        <strong>{event.name}</strong>
                      </h3>
                      <p className="card-text">
                        <small className="text-body-secondary">
                          {event.date}
                        </small>
                      </p>
                      <p className="card-text">{event.location}</p>
                      <p className="card-text">{event.genere}</p>
                      {event.precios.length > 0 && (
                        <div className="prices-fav-icon">
                          <a
                            className="card-prices"
                            href={event.precios[0].source.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.precios[0].price}
                          </a>
                          <button className="btn btn-warning fav-button">
                            <img
                              className="favIcon"
                              src={favIcon}
                              alt="Fav Icon"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              // </li>
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
