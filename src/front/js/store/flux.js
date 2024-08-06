import Swal from "sweetalert2";
import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { Context } from "../store/appContext";
import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ForgotPassword } from "../pages/forgotPassword";
import { ResetPassword } from "../pages/resetPassword";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      user: {
        photo: null,
        userName: "",
        name: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        id: null,
      },
      isAuthenticated: false,
      events: [],
      favourites: [],
    },
    actions: {
      successRegisterAlert: () => {
        Swal.fire({
          title: "Welcome Music Hunter!",
          text: "You're registered now",
          imageUrl:
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHcwZXlzZ2UzenlvaGVxZ2R6cTZka24ydmEydTBwZ2dqcjM2cDQ3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hxR2gm5IRPFSUfuCKC/giphy.webp",
          imageWidth: 400,
          imageHeight: 220,
          confirmButtonText: "OK",
          customClass: { popup: "sweet-dark" },
        });
      },

      successLoginAlert: () => {
        Swal.fire({
          title: "Done!",
          text: "Music Hunter logged!",
          imageUrl:
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWN5dTQxemZ0eTI2eW45NXFnM29qc2F2aTBuYnRwb3M4cGh6NTVpciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6KYPwNChIl8DRZL2TJ/giphy.webp",
          imageWidth: 400,
          imageHeight: 240,
          confirmButtonText: "OK",
        });
      },

      // successLoginAlertGif: () => {
      //   Swal.fire({
      //     title: "Music Hunter logged!",
      //     width: 600,
      //     padding: "3em",
      //     color: "#d34d7a",
      //     background: "url('img/concierto.jpg')",
      //     backdrop: `
      //       rgba(0,0,123,0.4)
      //       url("/src/front/img/giphy.gif")
      //       left top
      //       no-repeat
      //     `,
      //   });
      // },

      editUserAlert: () => {
        Swal.fire({
          title: "Well done!",
          text: "Changes saved!",
          icon: "success",
          confirmButtonText: "OK",
        });
      },

      errorPasswordAlert: () => {
        Swal.fire({
          title: "Ouch!",
          text: "Passwords doesn't match!",
          icon: "warning",
          confirmButtonText: "Try again",
        });
      },

      errorEmptyFieldsAlert: () => {
        Swal.fire({
          title: "Ops!",
          text: "You must complete all the fields!",
          icon: "info",
          confirmButtonText: "Try again",
          customClass: { popup: "sweet-dark" },
        });
      },

      errorLoginAlert: () => {
        Swal.fire({
          title: "Ops!",
          text: "Something went wrong...",
          icon: "error",
          confirmButtonText: "Try again",
        });
      },

      errorTokenAlert: () => {
        Swal.fire({
          title: "Ops!",
          text: "User not found...",
          icon: "error",
          confirmButtonText: "Try again",
        });
      },

      register: async (username, email, password1, password2) => {
        const actions = getActions();
        if (!username || !email || !password1 || !password2) {
          actions.errorEmptyFieldsAlert();
          console.log("Faltan campos");
          return false;
        }

        if (password1 !== password2) {
          console.log("Las contraseñas no coinciden");
          actions.errorPasswordAlert();
          return false;
        }

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              email: email,
              password: password1,
            }),
          });

          if (resp.ok) {
            const data = await resp.json();
            actions.successRegisterAlert();
            console.log("Usuario registrado exitosamente", data);
            return true;
          } else {
            const errorData = await resp.json();
            actions.errorLoginAlert();
            console.log("Error al registrar usuario:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al registrar usuario:", error);
          return false;
        }
      },

      login: async (email, password, rememberMe) => {
        const actions = getActions();
        if (!email || !password) {
          actions.errorEmptyFieldsAlert();
          console.log("Faltan campos");
          return false;
        }

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          if (resp.ok) {
            const data = await resp.json();
            if (rememberMe) {
              localStorage.setItem("token", data.access_token);
            } else {
              sessionStorage.setItem("token", data.access_token);
            }

            console.log("Usuario iniciado sesión exitosamente", data);
            actions.successLoginAlert();

            const decodeToken = jwtDecode(data.access_token);
            const { userName, name, last_name, email, phone, address, id } =
              decodeToken.sub || {};

            setStore({
              user: {
                userName: userName || "",
                name: name || "",
                lastName: last_name || "",
                email: email || "",
                phoneNumber: phone || "",
                address: address || "",
                id: id || "",
              },
              isAuthenticated: true,
            });

            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al iniciar sesión:", errorData.message);
            actions.errorLoginAlert();
            return false;
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          return false;
        }
      },
      forgotPassword: async (email) => {
        const actions = getActions();
        if (!email) {
          actions.errorEmptyFieldsAlert();
          console.log("Faltan campos");
          return false;
        }

        try {
          const resp = await fetch(
            `${process.env.BACKEND_URL}forgot-password`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
              }),
            }
          );
          if (resp.ok) {
            const data = await resp.json();
            console.log("Email enviado exitosamente", data);
            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al enviar email:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al enviar email:", error);
          return false;
        }
      },
      resetPassword: async (token, password1, password2) => {
        const actions = getActions();
        if (!password1 || !password2) {
          actions.errorEmptyFieldsAlert();
          console.log("Faltan campos");
          return false;
        }

        if (password1 !== password2) {
          console.log("Las contraseñas no coinciden");
          actions.errorPasswordAlert();
          return false;
        }

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}reset-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              password: password1,
            }),
          });

          if (resp.ok) {
            const data = await resp.json();
            console.log("Contraseña cambiada exitosamente", data);
            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al cambiar contraseña:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al cambiar contraseña:", error);
          return false;
        }
      },

      getUserDataFromToken: () => {
        const actions = getActions();

        const token = localStorage.getItem("token")
          ? localStorage.getItem("token")
          : sessionStorage.getItem("token");

        if (!token) {
          console.log("No hay token almacenado");
          return null;
        }
        try {
          const decodeToken = jwtDecode(token);
          const { sub } = decodeToken;

          const { username, name, last_name, email, phone, address, id } = sub;

          setStore({
            user: {
              userName: username || "",
              name: name || "",
              lastName: last_name || "",
              email: email || "",
              phoneNumber: phone || "",
              address: address || "",
              id: id || "",
            },
            isAuthenticated: true,
          });
          console.log(sub);
          return true;
          // return {
          //   username,
          //   name,
          //   last_name,
          //   email,
          //   phone,
          //   address,
          // };
        } catch (error) {
          actions.errorTokenAlert();
          console.log(error);
          return false;
        }
      },

      events: async () => {
        const actions = getActions();
        const store = getStore();
        console.log(`${process.env.BACKEND_URL}api/events`);

        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/events`);
          const data = await resp.json();
          setStore({ events: [] });
          for (let event of data) {
            setStore({ events: [...store.events, event] });
          }

          // console.log(data);
          console.log(store.events);
        } catch (error) {
          console.log(error);
          return false;
        }
      },

      getUser: async (id) => {
        const actions = getActions();
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/user/${id}`);
          if (resp.ok) {
            const data = await resp.json();
            console.log(data);
            setStore({
              user: {
                id: data.id,
                userName: data.username,
                name: data.name,
                lastName: data.last_name,
                email: data.email,
                phoneNumber: data.phone,
                address: data.address,
              },
              isAuthenticated: true,
            });
          } else {
            console.log("Error al obtener usuario");
            return false;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      editUser: async (
        photo,
        id,
        userName,
        name,
        lastName,
        phoneNumber,
        address
      ) => {
        const actions = getActions();
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/user/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("token")
                  ? localStorage.getItem("token")
                  : sessionStorage.getItem("token")
              }`,
            },
            body: JSON.stringify({
              profile_picture: photo,
              username: userName,
              name: name,
              last_name: lastName,
              phone: phoneNumber,
              address: address,
            }),
          });

          if (resp.ok) {
            const data = await resp.json();
            actions.editUserAlert();
            console.log("Usuario editado exitosamente", data);
            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al editar usuario:", errorData.message);
            return false;
          }
        } catch (error) {
          actions.errorLoginAlert();
          console.error("Error al editar usuario:", error);
          return false;
        }
      },

      addFavourite: async (userId, eventId) => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/favorites`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("token")
                  ? localStorage.getItem("token")
                  : sessionStorage.getItem("token")
              }`,
            },
            body: JSON.stringify({
              user_id: userId,
              event_id: eventId,
            }),
          });

          if (resp.ok) {
            const newFavourite = await resp.json();
            console.log(
              "Evento añadido a favoritos exitosamente",
              newFavourite
            );

            const store = getStore();
            setStore({ favourites: [...store.favourites, newFavourite] });
            return true;
          } else {
            const errorData = await resp.json();
            console.log(
              "Error al añadir evento a favoritos:",
              errorData.message
            );
            return false;
          }
        } catch (error) {
          console.error("Error al añadir evento a favoritos:", error);
          return false;
        }
      },

      getFavourites: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/favorites`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("token")
                  ? localStorage.getItem("token")
                  : sessionStorage.getItem("token")
              }`,
            },
          });

          if (resp.ok) {
            const favourites = await resp.json();
            console.log("Favoritos obtenidos exitosamente", favourites);
            setStore({ favourites });

            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al obtener favoritos:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al obtener favoritos:", error);
          return false;
        }
      },

      deleteFavourite: async (id) => {
        try {
          const resp = await fetch(
            `${process.env.BACKEND_URL}api/favorite/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  localStorage.getItem("token")
                    ? localStorage.getItem("token")
                    : sessionStorage.getItem("token")
                }`,
              },
            }
          );

          if (resp.ok) {
            console.log("Favorito eliminado exitosamente");

            const store = getStore();
            setStore({
              favourites: store.favourites.filter((fav) => fav.id !== id),
            });

            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al eliminar favorito:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al eliminar favorito:", error);
          return false;
        }
      },

      deleteUser: async (id) => {
        const actions = getActions();
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}api/user/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (resp.ok) {
            const data = await resp.json();
            console.log("Usuario eliminado exitosamente", data);
            return true;
          } else {
            const errorData = await resp.json();
            console.log("Error al eliminar usuario:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          return false;
        }
      },
    },
  };
};

export default getState;
