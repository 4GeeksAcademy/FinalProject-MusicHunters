import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import { HomeUser } from "./homeUser";

export const Register = (props) => {
  const { store, actions } = useContext(Context);
  const params = useParams();

  const [dataContact, setDataContact] = useState({
    userName: "",
    emailAdress: "",
    password: "",
    confirmPassword: "",
  });

  const handleAddContact = (event) => {
    event.preventDefault();

    actions.register(
      dataContact.userName,
      dataContact.emailAdress,
      dataContact.password,
      dataContact.confirmPassword
    );
    setDataContact({
      userName: "",
      emailAdress: "",
      password: "",
      confirmPassword: "",
    });
  };

  const inputValue = (e) => {
    const { name, value } = e.target;
    setDataContact((prevDataContact) => ({
      ...prevDataContact,
      [name]: value,
    }));
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleViewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center register-header mb-3">Register</h1>
      <form className="mx-auto" onSubmit={handleAddContact}>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            User Name <span className="required-asterisk">*</span>
          </label>
          <input
            onChange={inputValue}
            type="text"
            className="form-control mb-3"
            id="userName"
            name="userName"
            aria-describedby="userName"
            placeholder="User Name"
            value={dataContact.userName}
          />

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
          <label htmlFor="exampleInputEmail1" className="form-label">
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
        <div className="mb-3">
          <label htmlFor="exampleInputPassword2" className="form-label">
            Confirm Password <span className="required-asterisk">*</span>
          </label>
          <div className="input-group">
            <input
              onChange={inputValue}
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              id="exampleInputPassword2"
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
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />

          <label className="form-check-label mr-1" htmlFor="exampleCheck1">
            Remember me
          </label>
        </div>
        <div className="form-buttons d-flex justify-content-between">
          {/* <Link to="/homeUser/:id"> */}
          <button
            type="submit"
            className="btn btn-warning"
            // onClick={() => actions.register()}
          >
            Submit
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

Register.propTypes = {
  match: PropTypes.object,
};
