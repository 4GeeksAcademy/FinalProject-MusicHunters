import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";
import Swal from "sweetalert2";

export const ResetPassword = () => {
  const { store, actions } = useContext(Context);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const toggleViewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  /*-------useState y función para mantener sesión iniciada------*/

  const [rememberMe, setRememberMe] = useState(false);

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };
  /*-----------------------------------------------------------------*/
  const [dataContact, setDataContact] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleAddContact = async (event) => {
    event.preventDefault();
    const loginSuccess = await actions.login(
      dataContact.emailAdress,
      dataContact.password,
      rememberMe
    );

    if (loginSuccess) {
      navigate("/homeUser");
    }

    // setDataContact({
    //   emailAdress: "",
    //   password: "",
    // });
  };
  const inputValue = (e) => {
    const { name, value } = e.target;
    setDataContact((prevDataContact) => ({
      ...prevDataContact,
      [name]: value,
    }));
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center reset-password-header mb-3">Reset Password</h1>
      <form className="mx-auto" onSubmit={handleAddContact}>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            New Password <span className="required-asterisk">*</span>
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
        <div className="mb-3">
          <label htmlFor="confirmInputPassword1" className="form-label">
            Confirm Password <span className="required-asterisk">*</span>
          </label>
          <div className="input-group">
            <input
              onChange={inputValue}
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              id="confirmInputPassword1"
              name="confirmPassword"
              placeholder="**********"
              value={dataContact.confirmPassword}
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
              checked={rememberMe}
              onChange={handleRememberMe}
            />

            <label className="form-check-label" htmlFor="exampleCheck1">
              Remember me
            </label>
          </div>
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
