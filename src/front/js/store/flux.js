import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      user: null,
      isAuthenticated: false,
    },
    actions: {
      successRegisterAlert: () => {
        Swal.fire({
          title: "Done!",
          text: "Wellcome Music Hunter! You're registered now",
          imageUrl:
            "https://i.pinimg.com/736x/4e/2e/86/4e2e8641ef36f78f9480d062843f653a.jpg",
          imageWidth: 400,
          imageHeight: 200,
          confirmButtonText: "OK",
          customClass: { popup: "sweet-dark" },
        });
      },

      successLoginAlert: () => {
        Swal.fire({
          title: "Done!",
          text: "Music Hunter login!",
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
            console.log("Error al registrar usuario:", errorData.message);
            return false;
          }
        } catch (error) {
          console.error("Error al registrar usuario:", error);
          return false;
        }
      },

      login: async (email, password) => {
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
            console.log("Usuario iniciado sesión exitosamente", data);
            actions.successLoginAlert();

            sessionStorage.setItem("token", data.token);

            setStore({
              user: data.user,
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
    },
  };
};

export default getState;
