import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { EventsFilter } from "../component/eventsFilter";
import { NavbarUser } from "../component/navbarUser";
import { ScrollNavigateToTop } from "../component/scrollNavigateToTop";

export const FilteredEvents = () => {
  return (
    <>
      <EventsFilter />
      <ScrollNavigateToTop />
    </>
  );
};
