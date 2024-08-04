import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { EventsFilter } from "../component/eventsFilter";
import { NavbarUser } from "../component/navbarUser";
import { ScrollNavigateToTop } from "../component/scrollNavigateToTop";

export const FilteredEvents = () => {
  const { store } = useContext(Context);
  const [selectedGenere, setSelectedGenere] = useState(null);
  const eventsFilterBy = store.events || [];
  const filterByGenere = eventsFilterBy.filter(
    (event) => event.genere === selectedGenere
  );
  const handleGenereClick = (genere) => {
    setSelectedGenere(genere);
  };

  useEffect(() => {
    handleGenereClick();
  });
  return (
    <>
      {/* <NavbarUser /> */}
      <EventsFilter />
      <ScrollNavigateToTop />
    </>
  );
};
