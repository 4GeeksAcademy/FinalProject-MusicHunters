import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import favIcon from "../../img/favourites.png";
import { ScrollNavigateToTop } from "../component/scrollNavigateToTop";

export const Search = () => {
  const { store } = useContext(Context);

  // Función para formatear los precios con sus URLs correspondientes
  const formatPrices = (prices, urls) => {
    if (
      !Array.isArray(prices) ||
      !Array.isArray(urls) ||
      prices.length !== urls.length
    ) {
      return null;
    }

    return prices.map((price, index) => (
      <React.Fragment key={index}>
        <a
          href={urls[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="card-price-link"
        >
          {price}
        </a>
        {index < prices.length - 1 && " "}
      </React.Fragment>
    ));
  };

  const filterUniqueEvents = (events) => {
    const seenEvents = new Set();

    return events.filter((event) => {
      const identifier = `${event.title}-${event.date}-${event.place}`;
      if (seenEvents.has(identifier)) {
        return false; // Evento repetido, omitir
      } else {
        seenEvents.add(identifier);
        return true; // Evento nuevo, añadir
      }
    });
  };
  const uniqueEvents = filterUniqueEvents(store.events || []);
  return (
    <>
      <NavbarUser />
      <h1 className="text-center reset-password-header mb-5">
        Search your events
      </h1>
      <div className="container">
        {uniqueEvents.length === 0 ? (
          <p className="text-center fs-3">There's no events to show</p>
        ) : (
          <div className="row">
            {uniqueEvents.map((event) => (
              <div className="col-md-6 mb-4" key={event.id}>
                <div
                  className="card mx-auto cards-events"
                  style={{ maxWidth: "540px" }}
                >
                  <div className="row g-0 p-2 event-card">
                    <div className="col-md-4">
                      <img
                        src={event.image_url}
                        className="img-fluid rounded-start"
                        alt={event.title}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h3 className="card-events-title">
                          <strong>{event.title}</strong>
                        </h3>
                        <p className="card-text">
                          <small className="text-body-secondary">
                            {event.date}
                          </small>
                        </p>
                        <p className="card-text">{event.place}</p>
                        <p className="card-text">{event.genere}</p>
                        {event.price.length > 0 && event.buy_url.length > 0 && (
                          <div className="prices-fav-icon">
                            {/* Utilizar la función para mostrar los precios con URLs */}
                            {formatPrices(event.price, event.buy_url)}
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
              </div>
            ))}
          </div>
        )}
        {/* PAGINACIÓN
          <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link">Previous</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </nav> */}
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
      <ScrollNavigateToTop />
    </>
  );
};
