import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";
import Swal from "sweetalert2";

export const ResetPassword = () => {
  const { store, actions } = useContext(Context);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [dataContact, setDataContact] = useState({
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const toggleViewPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const inputValue = (e) => {
    const { name, value } = e.target;
    setDataContact((prevDataContact) => ({
      ...prevDataContact,
      [name]: value,
    }));
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    const token = new URLSearchParams(location.search).get("token");
    console.log(token);

    const resetSuccess = await actions.resetPassword(
      token,
      dataContact.password,
      dataContact.confirmPassword
    );

    if (resetSuccess) {
      Swal.fire("Success", "Password has been reset successfully", "success");
      navigate("/login");
    } else {
      Swal.fire("Error", "Failed to reset password", "error");
    }
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

        <div className="form-buttons d-flex justify-content-between">
          <button type="submit" className="btn btn-warning">
            Save
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
