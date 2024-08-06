import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const SearchResults = () => {
  const { store } = useContext(Context);

  return (
    <div>
      <h1 className="text-center">Resultados de Búsqueda</h1>
      {store.searchResults.length === 0 ? (
        <p className="text-center">No se encontraron resultados</p>
      ) : (
        store.searchResults.map((event) => (
          <div
            key={event.id}
            className="card mb-3 mx-auto"
            style={{ maxWidth: "540px" }}
          >
            <img
              src={event.image_url}
              className="card-img-top"
              alt={event.title}
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="card-title">{event.title}</h5>
              <p className="card-text">
                <strong>Fecha:</strong> {event.date}
              </p>
              <p className="card-text">
                <strong>Lugar:</strong> {event.place}
              </p>
              <p className="card-text">
                <strong>Género:</strong> {event.genere}
              </p>
              <a
                href={event.buy_url[0]}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Comprar Entradas
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
