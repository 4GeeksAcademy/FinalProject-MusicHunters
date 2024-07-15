import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navbar } from "../component/navbar";


export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
    <Navbar />
    <div className="text-center mt-5">
      {/* <h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p> */}
      <h1 className="title-music-hunters">Music Hunters Home</h1>
      <h3 className="subtitle">
        Your website to find tickets to the best musical events at the best
        price!
      </h3>
      <ul className="mt-5 mb-5">
        <li className="card p-3 d-flex flex-row align-items-center mb-4">
          <img src="https://www.estupidafregona.net/wp-content/uploads/2023/12/mc2024-cabecera.png" />
          <p>Probando si el error está solucionado</p>
        </li>
      </ul>
    </div>
    </>
  );
};
