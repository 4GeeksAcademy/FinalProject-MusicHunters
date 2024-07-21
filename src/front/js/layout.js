import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { ProtectedRoute } from "./component/utils/ProtectedRoute";
import { Home } from "./pages/home";
import { HomeUser } from "./pages/homeUser";
import { Login } from "./pages/login";
import { ForgotPassword } from "./pages/forgotPassword";
import { Register } from "./pages/register";
import { Search } from "./pages/search";
import { MyProfile } from "./pages/userProfile";
import "../../../src/front/styles/home.css";
import injectContext, { Context } from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Favourites } from "./pages/favourites";
import { NotFound } from "./pages/notFound";
import { EditProfile } from "./pages/editProfile";

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
          <div className="content-container">
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Register />} path="/register" />
              <Route element={<Login />} path="/login" />
              <Route element={<ForgotPassword />} path="login/forgotPassword" />
              {/* <Route element={<ProtectedRoute canActivate={comprobar en bbdd} />}> */}
              <Route element={<HomeUser />} path="/homeUser/:id" />
              <Route element={<MyProfile />} path="/userProfile/:id" />
              <Route element={<EditProfile />} path="/editProfile/:id" />
              <Route element={<Search />} path="/search/:id" />
              <Route element={<Favourites />} path="/favourites/:id" />
              {/* </Route> */}
              <Route element={<NotFound />} path="*" />
            </Routes>
          </div>
          <div className="content-container">
            <Footer />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
