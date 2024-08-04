import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Navbar } from "../component/navbar";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (actions.getUserDataFromToken() === true) {
      navigate("/homeUser");
    }

    console.log(store.isAuthenticated);
  }, []);

  const eventsCarrousel = [
    {
      title: "Niña Pastori - Cabaret Festival - Algeciras",
      date: "04/08/2024",
      place: "Algeciras",
      price: "38,50€",
      product_type: "Pop",
      image_url:
        "https://d2cyzdatssrhg7.cloudfront.net/export/sites/default/ets/.content/products/img/00-0008994.jpg?__locale=es",
      buy_url:
        "https://www.elcorteingles.es/entradas/conciertos/entradas-nina-pastori-cabaret-festival-algeciras-2024-08-04/",
      source: "elcorteingles.es",
    },
    {
      title: "Melendi",
      date: "22/08/2024",
      place: "Santander",
      price: "42,90€",
      product_type: "Pop",
      image_url:
        "https://d2cyzdatssrhg7.cloudfront.net/export/sites/default/ets/.content/products/img/00-00089an.jpg?__locale=es",
      buy_url:
        "https://www.elcorteingles.es/entradas/conciertos/entradas-melendi-santander/",
      source: "elcorteingles.es",
    },
    {
      title: "Pablo López - Cabaret Festival",
      date: "14/08/2024",
      place: "El Puerto de Santa María",
      price: "44,00€",
      product_type: "Pop",
      image_url:
        "https://d2cyzdatssrhg7.cloudfront.net/export/sites/default/ets/.content/products/img/00-000890L.jpg?__locale=es",
      buy_url:
        "https://www.elcorteingles.es/entradas/conciertos/entradas-pablo-lopez-cabaret-festival-puerto-de-santa-maria-el/",
      source: "elcorteingles.es",
    },
    {
      title: "David Bisbal - Cabaret Festival",
      date: "13/08/2024",
      place: "El Puerto de Santa María",
      price: "44,00€",
      product_type: "Pop",
      image_url:
        "https://d2cyzdatssrhg7.cloudfront.net/export/sites/default/ets/.content/products/img/00-000890l.jpg?__locale=es",
      buy_url:
        "https://www.elcorteingles.es/entradas/conciertos/entradas-david-bisbal-cabaret-festival-puerto-de-santa-maria-el/",
      source: "elcorteingles.es",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container text-center mt-5">
        <h1 className="title-music-hunters">Music Hunters Home</h1>
        <h3 className="subtitle">
          ¡Encuentra el mejor precio para los mejores eventos musicales!
        </h3>
        <Link to="/register/">
          <button className="btn btn-dark home-button">
            ¡Crea tu cuenta para acceder ahora!
          </button>
        </Link>
      </div>
      <div className="container text-center mt-5">
        <div id="carouselExampleDark" className="carousel carousel-dark slide">
          <div className="carousel-indicators">
            {eventsCarrousel.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {eventsCarrousel.map((event, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                data-bs-interval="4000"
              >
                <img
                  src={event.image_url}
                  className="d-block w-100 img-fluid"
                  alt={event.title}
                />
                {/* <div className="carousel-caption d-none d-md-block">
                  <h5>{event.title}</h5>
                  <p>Contenido de marcador de posición representativo.</p>
                </div> */}
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </>
  );
};
