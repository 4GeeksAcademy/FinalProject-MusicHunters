
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {

			user: null, 
			isAuthenticated: false 
		},
		actions: {
			register: async (username, email, password1, password2) => {
	
				if (!username || !email || !password1 || !password2) {
					console.log("Faltan campos");
					return false;
				}	
			
				if (password1 !== password2) {
					console.log("Las contraseñas no coinciden");
					return false;
				}

				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/register`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							username: username,
							email: email,
							password: password1
						})
					});

		
					if (resp.ok) {
						const data = await resp.json();
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
				
				if (!email || !password) {
					console.log("Faltan campos");
					return false;
				}

				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email,
							password: password
						})
					});

					if (resp.ok) {
						const data = await resp.json();
						console.log("Usuario iniciado sesión exitosamente", data);


						sessionStorage.setItem("token", data.token);

					
						setStore({
							user: data.user, 
							isAuthenticated: true
						});

						return true;
					} else {
						const errorData = await resp.json();
						console.log("Error al iniciar sesión:", errorData.message);
						return false;
					}
				} catch (error) {
					console.error("Error al iniciar sesión:", error);
					return false;
				}
			}
		}
	};
};

export default getState;

