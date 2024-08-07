import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";

export const ForgotPassword = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [emailContact, setEmailContact] = useState({});


  const inputValue = (e) => {
    const { value } = e.target;
    setEmailContact((prevemailContact) => ({
      ...prevemailContact,
      value,
    }));
  };

  const handleAddContact = async (event) => {
    event.preventDefault();

    console.log(emailContact.value);
    const sendForgotPassword = await actions.forgotPassword(emailContact.value);

    if (sendForgotPassword == true) {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center reset-password-header mb-3">
        Forgot Password
      </h1>

      <form className="mx-auto" onSubmit={(event) => handleAddContact(event)}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            onChange={inputValue}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="example@email.com"
          />
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="top"></span>
          <span className="left"></span>
          <div className="form-text passwordHelp">
            If there's a user associated with this email you'll receive an email
            to reset your password
          </div>
        </div>

        <div className="form-buttons d-flex justify-content-between">
          <button type="submit" className="btn btn-warning">
            Send
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
