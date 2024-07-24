import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [dataContact, setDataContact] = useState({
    emailAdress: "",
    password: "",
  });

  const inputValue = (e) => {
    const { name, value } = e.target;
    setDataContact((prevDataContact) => ({
      ...prevDataContact,
      [name]: value,
    }));
  };

  // Funcion para visualizar el password

  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleViewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // ---------------------------------------

  // const onSubmit = () => {
  //   navigate("/homeUser/:id");
  // };

  const handleAddContact = async (event) => {
    event.preventDefault();

    await actions.login(dataContact.emailAdress, dataContact.password);

    setDataContact({
      emailAdress: "",
      password: "",
    });
    navigate("/homeUser");
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center login-header mb-3">Login</h1>

      <form className="mx-auto" onSubmit={handleAddContact}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address <span className="required-asterisk">*</span>
          </label>
          <input
            onChange={inputValue}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="emailAdress"
            aria-describedby="emailHelp"
            placeholder="example@email.com"
            value={dataContact.emailAdress}
          />

          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password <span className="required-asterisk">*</span>
          </label>
          <div className="input-group">
            <input
              onChange={inputValue}
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              placeholder="**********"
              value={dataContact.password}
            />
            <button
              type="button"
              className="btn btn-outline-secondary show-password"
              onClick={toggleViewPassword}
            >
              <i
                className={passwordVisible ? "far fa-eye-slash" : "far fa-eye"}
              ></i>
            </button>
          </div>
        </div>

        <div className="mb-3 form-check d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              id="exampleCheck1"
            />

            <label className="form-check-label" htmlFor="exampleCheck1">
              Remember me
            </label>
          </div>
          <Link to="forgotpassword" className="forgot-password">
            Forgot my password
          </Link>
        </div>
        <div className="form-buttons d-flex justify-content-between">
          {/* <Link to="homeUser/:id"> */}
          <button
            type="submit"
            className="btn btn-warning"
            //onClick={() => actions.nombreDeFuncionDelFlux(dataContact)}
          >
            Login
          </button>
          {/* </Link> */}
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
