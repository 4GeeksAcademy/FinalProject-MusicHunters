import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Navbar } from "../component/navbar";
import Swal from "sweetalert2";

export const Home = () => {
  const { store, actions } = useContext(Context);
  useEffect(() => {
    console.log(store.isAuthenticated);
  });

  return (
    <>
      <Navbar />
      <div className="container text-center mt-5">
        <h1 className="title-music-hunters">Music Hunters Home</h1>
        <h3 className="subtitle">The best events at the best price!</h3>
        <button className="btn btn-dark" onClick={actions.events}>
          Events
        </button>
      </div>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide container mx-auto mt-2"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://d7lju56vlbdri.cloudfront.net/var/ezwebin_site/storage/images/_aliases/img_1col/reportajes/cuando-volveremos-a-ir-a-conciertos-con-normalidad/8867610-2-esl-MX/Cuando-volveremos-a-ir-a-conciertos-con-normalidad.png"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://s2.abcstatics.com/abc/www/multimedia/espana/2024/06/01/dreambeach-villaricos-festival-almeria-Re9nb15fn8ZbxHYx5OZSLvM-1200x840@diario_abc.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://estaticosgn-cdn.deia.eus/clip/5ce529aa-cbab-44b4-ae48-63713c90067d_16-9-discover-aspect-ratio_default_0.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};
