import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { ScrollNavigateToTop } from "../component/scrollNavigateToTop";
import { NavbarUser } from "../component/navbarUser";
import favIcon from "../../img/favourites.png";
import Modal from "../component/modal";

export const FilteredEvents = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const { genere } = location.state || {}; // Obtener el género desde el estado pasado por navigate
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (genere) {
      const eventsFilterBy = store.events || [];
      const filtered = eventsFilterBy.filter(
        (event) => event.genere === genere
      );
      setFilteredEvents(filtered); // Actualizar el estado con los eventos filtrados
    }
  }, [genere, store.events]);

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
          onClick={(e) => e.stopPropagation()}
        >
          From {price}
        </a>
        {index < prices.length - 1 && " "}
      </React.Fragment>
    ));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

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
      <div className="container mt-5">
        <h1 className="filtered-events-title">You choose {genere}</h1>
        <Link to="/homeUser">
          <button type="button" className="btn btn-dark mx-auto mb-5">
            Back
          </button>
        </Link>
        <div className="row">
          {filteredEvents.map((event) => (
            <div className="col-md-6 mb-4" key={event.id}>
              <div
                className="card mx-auto cards-events"
                style={{ maxWidth: "540px" }}
                onClick={() => handleEventClick(event)}
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
                      <p className="card-text mb-1">{event.place}</p>
                      <p className="card-text">{event.genere}</p>

                      <div className="prices-fav-icon mb-auto">
                        {/* {formatPrices(event.price, event.buy_url)} */}
                        <a className="card-text link-price">
                          From{" "}
                          {Math.min(
                            ...event.price.map((price) => parseFloat(price))
                          ).toFixed(2)}
                          €
                        </a>
                        <button
                          className={`btn fav-button ${
                            store.favourites.some((fav) => fav.id === event.id)
                              ? "fav-active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevenir el cierre del modal cuando se hace clic en el botón de favoritos
                            handleFavouriteClick(event);
                          }}
                        >
                          <img
                            className="favIcon"
                            src={favIcon}
                            alt="Fav Icon"
                            style={{ width: "24px", height: "24px" }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScrollNavigateToTop />

      {/* Usar el componente Modal */}
      {selectedEvent && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedEvent.title}
          imageUrl={selectedEvent.image_url}
          date={selectedEvent.date}
          place={selectedEvent.place}
          genre={selectedEvent.genere}
          prices={selectedEvent.price}
          buyUrls={selectedEvent.buy_url}
          description={selectedEvent.description}
        />
      )}
    </>
  );
};
