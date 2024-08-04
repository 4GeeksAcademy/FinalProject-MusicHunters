import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { NavbarUser } from "./navbarUser";
import favIcon from "../../img/favourites.png";

export const EventsFilter = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  // Estado para el género seleccionado
  const [selectedGenere, setSelectedGenere] = useState(null);

  // Referencia para la primera tarjeta de evento
  const firstEventRef = useRef(null);

  // Accede a los eventos desde el store
  const eventsFilterBy = store.events || [];

  // Filtro eventos por el género seleccionado
  const filterByGenere = eventsFilterBy.filter(
    (event) => event.genere === selectedGenere
  );

  // useEffect(() => {
  //   if (selectedGenere && filterByGenere.length > 0) {
  //     navigate("/filteredEvents");
  //   }
  // }, [selectedGenere, filterByGenere, navigate]);

  // Función para manejar el clic en una tarjeta de género
  const handleGenereClick = (genere) => {
    setSelectedGenere(genere);
    setTimeout(() => {
      // Si hay eventos filtrados, desplazarse al primero
      if (firstEventRef.current) {
        firstEventRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
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
          {/* Cada tarjeta representa un género musical */}
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
            onClick={() => handleGenereClick("Rap Hip Hop")}
          >
            <div className="card-music-type rap-card">
              <p className="heading-music-type">RAP HIP HOP</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Indie Alternativo")}
          >
            <div className="card-music-type indie-card">
              <p className="heading-music-type">INDIE ALTERNATIVO</p>
            </div>
          </div>
          <div
            className="col-md-6 col-lg-3 mb-5"
            onClick={() => handleGenereClick("Dance Electronica")}
          >
            <div className="card-music-type dance-card">
              <p className="heading-music-type">DANCE ELECTRONICA</p>
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

        {/* Se renderizan los eventos filtrados aquí */}
        <div className="container">
          {filterByGenere.map((event, index) => (
            <div className="row" key={`${event.id}-${index}`}>
              {/* // Navego a la primera tarjeta */}
              <div
                ref={index === 0 ? firstEventRef : null}
                className="event-card"
              >
                <div className="col-md-6 mb-4">
                  <div
                    className="card mx-auto cards-events"
                    // style={{ maxWidth: "540px" }}
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
                          {event.price.length > 0 && (
                            <div className="prices-fav-icon">
                              <a
                                className="card-prices"
                                href={event.buy_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {event.price[0]}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
