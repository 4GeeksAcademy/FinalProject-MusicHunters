import React, { useContext, useEffect, useState } from "react";
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
  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      navigate("/filteredEvents");
    }
  };
  const handleGenereClick = (genere) => {
    setSelectedGenere(genere);
    handleFilterClick();
  };

  // Estado para el género seleccionado
  const [selectedGenere, setSelectedGenere] = useState(null);

  const eventsFilterBy = store.events || [];

  // Filtro eventos por el género seleccionado
  const filterByGenere = eventsFilterBy.filter(
    (event) => event.genere === selectedGenere
  );

  return (
    <>
      <NavbarUser />
      <div className="container text-center mt-5">
        <h1 className="title-music-hunters">Music Hunters Home</h1>
        <h3 className="subtitle mb-5">
          Find the best price for the best music events!
        </h3>

        <div className="row g-2 justify-content-center ms-auto">
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
        <ScrollNavigateToTop />

        {showFilter && <EventsFilter />}
      </div>
    </>
  );
};
