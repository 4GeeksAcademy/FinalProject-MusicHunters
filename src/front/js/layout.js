import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { HomeUser } from "./pages/homeUser";
import { Login } from "./pages/login";
import { ForgotPassword } from "./pages/forgotPassword";
import { Register } from "./pages/register";
import { Search } from "./pages/search";
import { MyProfile } from "./pages/userProfile";

import injectContext, { Context } from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Favourites } from "./pages/favourites";
import { NotFound } from "./pages/notFound";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<HomeUser />} path="/homeUser/:id" />
            <Route element={<Login />} path="/login" />
            <Route element={<ForgotPassword />} path="login/forgotPassword" />
            <Route element={<Register />} path="/register" />
            <Route element={<MyProfile />} path="/userProfile/:id" />
            <Route element={<Search />} path="/search/:id" />
            <Route element={<Favourites />} path="/favourites/:id" />
            <Route element={<NotFound />} path="*" />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
