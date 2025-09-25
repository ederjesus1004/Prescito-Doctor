import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [state, setState] = useState("Registrarse");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { backendUrl, token, setToken } = useContext(AppContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (state === "Registrarse") {
            const { data } = await axios.post(
                backendUrl + "/api/user/register",
                {
                    name,
                    email,
                    password,
                }
            );

            if (data.success) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
            } else {
                toast.error(data.message);
            }
        } else {
            const { data } = await axios.post(backendUrl + "/api/user/login", {
                email,
                password,
            });

            if (data.success) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
            } else {
                toast.error(data.message);
            }
        }
    };

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token]);

    return (
        <form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex items-center"
        >
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
                <p className="text-2xl font-semibold">
                    {state === "Registrarse"
                        ? "Crear Cuenta"
                        : "Iniciar Sesión"}
                </p>
                <p>
                    Por favor{" "}
                    {state === "Registrarse" ? "regístrate" : "inicia sesión"}{" "}
                    para reservar una cita
                </p>
                {state === "Registrarse" ? (
                    <div className="w-full ">
                        <p>Nombre Completo</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="border border-[#DADADA] rounded w-full p-2 mt-1"
                            type="text"
                            required
                        />
                    </div>
                ) : null}
                <div className="w-full ">
                    <p>Correo Electrónico</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="email"
                        required
                    />
                </div>
                <div className="w-full ">
                    <p>Contraseña</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="password"
                        required
                    />
                </div>
                <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
                    {state === "Registrarse"
                        ? "Crear cuenta"
                        : "Iniciar sesión"}
                </button>
                {state === "Registrarse" ? (
                    <p className="w-full text-center mt-3">
                        ¿Ya tienes una cuenta?{" "}
                        <span
                            onClick={() => setState("Login")}
                            className="text-primary underline cursor-pointer"
                        >
                            Inicia sesión aquí
                        </span>
                    </p>
                ) : (
                    <p>
                        ¿Crear una nueva cuenta?{" "}
                        <span
                            onClick={() => setState("Registrarse")}
                            className="text-primary underline cursor-pointer"
                        >
                            Haz clic aquí
                        </span>
                    </p>
                )}
                <p className="w-full text-center">
                    <span
                        onClick={() =>
                            (window.location.href =
                                "https://hospital-prescripto-admin.vercel.app/")
                        }
                        className="text-primary underline cursor-pointer hover:text-primary/80 transition-colors duration-200"
                    >
                        ¿Es administrador o doctor?
                    </span>
                </p>
            </div>
        </form>
    );
};

export default Login;
