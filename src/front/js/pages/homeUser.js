import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navbar } from "../component/navbar";
import { NavbarUser } from "../component/navbarUser";
import { EventsFilter } from "../component/eventsFilter";
import { useNavigate } from "react-router-dom";
import favIcon from "../../img/favourites.png";
import { ScrollNavigateToTop } from "../component/scrollNavigateToTop";

export const HomeUser = () => {
  useEffect(() => {
    actions.events();
  }, []);

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const firstEventRef = useRef(null);
  // const handleFilterClick = () => {
  //   setShowFilter(!showFilter);
  //   // if (!showFilter) {
  //   //   navigate("/filteredEvents");
  //   // }
  // };
  const handleGenereClick = (genere) => {
    setSelectedGenere(genere);
    setTimeout(() => {
      // Si hay eventos filtrados, desplazarse al primero
      if (firstEventRef.current) {
        firstEventRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
    // handleFilterClick();
  };

  // Estado para el género seleccionado
  const [selectedGenere, setSelectedGenere] = useState(null);

  const eventsFilterBy = store.events || [];

  // Filtro eventos por el género seleccionado
  const filterByGenere = eventsFilterBy.filter(
    (event) => event.genere === selectedGenere
  );
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

  const handleFavouriteClick = async (event) => {
    const favourite = store.favourites.find(
      (fav) => fav.id === event.id && fav.user_id === store.user.id
    );

    if (favourite) {
      await actions.deleteFavourite(favourite.favorite_id);
      actions.getFavourites();
    } else {
      await actions.addFavourite(store.user.id, event.id);
      actions.getFavourites();
    }
  };

  return (
    <>
      <NavbarUser />
      <div className="container text-center mt-5">
        <h1 className="title-music-hunters">Music Hunters Home</h1>
        <h3 className="subtitle mb-5">
          Find the best price for the best music events!
        </h3>

        <div className="row justify-content-center ms-auto">
          {/* Cada tarjeta representa un genere */}
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Pop")}
          >
            <div className="card-music-type pop-card">
              <p className="heading-music-type">POP</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Rock")}
          >
            <div className="card-music-type rock-card">
              <p className="heading-music-type">ROCK</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Latino")}
          >
            <div className="card-music-type latino-card">
              <p className="heading-music-type">LATINO</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Flamenco")}
          >
            <div className="card-music-type flamenco-card">
              <p className="heading-music-type">FLAMENCO</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Rap y Hip-hop")}
          >
            <div className="card-music-type rap-card">
              <p className="heading-music-type">RAP HIP HOP</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Indie y Alternativo")}
          >
            <div className="card-music-type indie-card">
              <p className="heading-music-type">INDIE ALTERNATIVO</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Dance y Electrónica")}
          >
            <div className="card-music-type dance-card">
              <p className="heading-music-type">DANCE ELECTRÓNICA</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Trap")}
          >
            <div className="card-music-type trap-card">
              <p className="heading-music-type">TRAP</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Reggaeton")}
          >
            <div className="card-music-type reggaeton-card">
              <p className="heading-music-type">REGGAETON</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {filterByGenere.map((event, index) => (
              <div className="col-md-6 mb-5" key={`${event.id}-${index}`}>
                {/* // Navego a la primera tarjeta */}
                <div ref={index === 0 ? firstEventRef : null}>
                  {/* <div className="row g-0 p-2 event-card"> */}
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
                              <button
                                className="btn btn-warning fav-button"
                                onClick={() => handleFavouriteClick(event)}
                              >
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
                  {/* </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ScrollNavigateToTop />

        {/* {showFilter && <EventsFilter />} */}
      </div>
    </>
  );
};
