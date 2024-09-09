import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { NavbarUser } from "../component/navbarUser";
import favIcon from "../../img/favourites.png";
import { ScrollNavigateToTop } from "../component/scrollNavigateToTop";
import Modal from "../component/modal"; // Importa el componente Modal

export const Search = () => {
  const { store, actions } = useContext(Context);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    actions.getFavourites();
  }, []);

  // Filtrar eventos según el término de búsqueda
  const filteredEvents = store.events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.genere.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueEvents = filteredEvents.filter(
    (event, index, self) =>
      index ===
      self.findIndex(
        (e) =>
          e.title === event.title &&
          e.date === event.date &&
          e.place === event.place
      )
  );

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
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.delete(event.id);
        return newFavorites;
      });
    } else {
      await actions.addFavourite(store.user.id, event.id);
      actions.getFavourites();
      setFavorites((prev) => new Set(prev).add(event.id));
    }
  };

  return (
    <>
      <NavbarUser />
      <h1 className="text-center reset-password-header mb-5">
        Results for {searchQuery}
      </h1>
      <div className="container">
        {uniqueEvents.length === 0 ? (
          <p className="text-center fs-3 text-no-results">
            No results found. Try again
          </p>
        ) : (
          <div className="row fix-row">
            {uniqueEvents.map((event) => (
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
                        <p className="card-text">{event.place}</p>
                        <p className="card-text">{event.genere}</p>
                        {event.price.length > 0 && event.buy_url.length > 0 && (
                          <div className="prices-fav-icon mb-0">
                            {event.price.map((price, index) => (
                              <a
                                key={index}
                                href={event.buy_url[index]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card-price-link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                From {price}
                              </a>
                            ))}
                            <button
                              className={`btn fav-button ${
                                store.favourites.some(
                                  (fav) => fav.id === event.id
                                )
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* El Modal */}
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
