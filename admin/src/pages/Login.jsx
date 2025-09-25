import axios from "axios";
import React, { useContext, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const Login = () => {
    const [state, setState] = useState("Admin");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { setDToken } = useContext(DoctorContext);
    const { setAToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (state === "Admin") {
            const { data } = await axios.post(backendUrl + "/api/admin/login", {
                email,
                password,
            });
            if (data.success) {
                setAToken(data.token);
                localStorage.setItem("aToken", data.token);
            } else {
                toast.error(data.message);
            }
        } else {
            const { data } = await axios.post(
                backendUrl + "/api/doctor/login",
                {
                    email,
                    password,
                }
            );
            if (data.success) {
                setDToken(data.token);
                localStorage.setItem("dToken", data.token);
            } else {
                toast.error(data.message);
            }
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex items-center"
        >
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
                <p className="text-2xl font-semibold m-auto">
                    <span className="text-primary">{state}</span> Iniciar sesión
                </p>
                <div className="w-full ">
                    <p>Correo electrónico</p>
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
                <button className="bg-primary text-white w-full py-2 rounded-md text-base">
                    Iniciar sesión
                </button>
                {state === "Admin" ? (
                    <p className="text-center w-full mt-5">
                        ¿Iniciar sesión como Doctor?{" "}
                        <span
                            onClick={() => setState("Doctor")}
                            className="text-primary underline cursor-pointer"
                        >
                            Haz clic aquí
                        </span>
                    </p>
                ) : (
                    <p>
                        ¿Iniciar sesión como Admin?{" "}
                        <span
                            onClick={() => setState("Admin")}
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
                                "https://hospital-prescripto-frontend.vercel.app/")
                        }
                        className="text-primary underline cursor-pointer hover:text-primary/80 transition-colors duration-200"
                    >
                        Pagina principal
                    </span>
                </p>
            </div>
        </form>
    );
};

export default Login;
