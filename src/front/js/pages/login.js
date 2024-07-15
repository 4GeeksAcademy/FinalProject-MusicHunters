import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

export const Login = () => {
  const { store, actions } = useContext(Context);

  // const inputValue = (e) => {
  //   const { name, value } = e.target;
  //   setDataContact((prevDataContact) => ({
  //     ...prevDataContact,
  //     [name]: value,
  //   }));
  // };

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

  return (
    <>
      <Navbar />
      <h1 className="text-center login-header mb-3">Login</h1>
      <form
        className="mx-auto"
        //onSubmit={handleAddContact}
      >
        <div className="mb-3">
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
            //value={dataContact.password} que hago con el hush?
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>
        </div>

        <div className="mb-3 form-check d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              id="exampleCheck1"
            />
            <span className="bottom"></span>
            <span className="right"></span>
            <span className="top"></span>
            <span className="left"></span>
            <label className="form-check-label" htmlFor="exampleCheck1">
              Remember me
            </label>
          </div>
          <Link to="forgotpassword" className="forgot-password">
            Forgot my password
          </Link>
        </div>
        <div className="form-buttons d-flex justify-content-between">
          <Link to="/:id">
            <button
              type="submit"
              className="btn btn-warning"
              //onClick={() => actions.nombreDeFuncionDelFlux(dataContact)}
            >
              Login
            </button>
          </Link>
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
