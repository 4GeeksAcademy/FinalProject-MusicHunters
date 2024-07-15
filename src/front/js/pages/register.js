import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
// import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Register = (props) => {
  // const { store, actions } = useContext(Context);
  const params = useParams();

  //const [dataContact, setDataContact] = useState;

  // const handleAddContact = (event) => {
  //   event.preventDefault();
  //   actions.nombreDeFuncionDeRegistro(dataContact);
  //   setDataContact({
  //     userName: "",
  //     emailAdress: "",
  //     password: "",
  //     confirmPassword: "",
  //   });
  // };

  // const inputValue = (e) => {
  //   const { name, value } = e.target;
  //   setDataContact((prevDataContact) => ({
  //     ...prevDataContact,
  //     [name]: value,
  //   }));
  // };

  return (
    <>
      <Navbar />
      <h1 className="text-center register-header mb-3">Register</h1>
      <form className="mx-auto">
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            User Name
          </label>
          <input
            // onChange={inputValue}
            type="text"
            className="form-control mb-3"
            id="userName"
            aria-describedby="userName"
            placeholder="User Name"
            //value={dataContact.userName}
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>

          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            // onChange={inputValue}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="example@email.com"
            //value={dataContact.email}
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            // onChange={inputValue}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="**********"
            //value={que hago con el hush?}
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword2" className="form-label">
            Confirm Password
          </label>
          <input
            // onChange={inputValue}
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            placeholder="**********"
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>
          <label className="form-check-label mr-1" htmlFor="exampleCheck1">
            Remember me
          </label>
        </div>
        <div className="form-buttons d-flex justify-content-between">
          <button
            type="submit"
            className="btn btn-warning"
            //onClick={() => actions.nombreDeFuncionDelFlux(dataContact)}
          >
            Submit
          </button>

          <Link to="/">
            <button type="button" className="btn btn-dark">
              Back home
            </button>
          </Link>
        </div>
      </form>
    </>
  );
};

Register.propTypes = {
  match: PropTypes.object,
};
