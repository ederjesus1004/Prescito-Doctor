import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { token, setToken, userData } = useContext(AppContext);

    const logout = () => {
        localStorage.removeItem("token");
        setToken(false);
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
            <img
                onClick={() => navigate("/")}
                className="w-44 cursor-pointer"
                src={assets.logo}
                alt=""
            />
            <ul className="md:flex items-start gap-5 font-medium hidden">
                <NavLink to="/">
                    <li className="py-1">INICIO</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/doctors">
                    <li className="py-1">DOCTORES</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/about">
                    <li className="py-1">SOBRE NOSOTROS</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/contact">
                    <li className="py-1">CONTACTO</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
            </ul>

            <div className="flex items-center gap-4">
                {token && userData ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img
                            className="w-8 rounded-full"
                            src={userData.image}
                            alt=""
                        />
                        <img
                            className="w-2.5"
                            src={assets.dropdown_icon}
                            alt=""
                        />
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4">
                                <p
                                    onClick={() => navigate("/my-profile")}
                                    className="hover:text-black cursor-pointer"
                                >
                                    Mi Perfil
                                </p>
                                <p
                                    onClick={() => navigate("/my-appointments")}
                                    className="hover:text-black cursor-pointer"
                                >
                                    Mis Citas
                                </p>
                                <p
                                    onClick={logout}
                                    className="hover:text-black cursor-pointer"
                                >
                                    Cerrar sesión
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
                    >
                        Crear cuenta
                    </button>
                )}
                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden"
                    src={assets.menu_icon}
                    alt=""
                />

                {/* Menú móvil mejorado */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
                        showMenu ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                    onClick={() => setShowMenu(false)}
                >
                    <div
                        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                            showMenu ? "translate-x-0" : "translate-x-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <img src={assets.logo} className="h-8 w-auto" alt="Logo" />
                                <button
                                    onClick={() => setShowMenu(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <img src={assets.cross_icon} className="w-6 h-6" alt="Cerrar" />
                                </button>
                            </div>

                            <ul className="space-y-4">
                                <NavLink
                                    to="/"
                                    onClick={() => setShowMenu(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    INICIO
                                </NavLink>
                                <NavLink
                                    to="/doctors"
                                    onClick={() => setShowMenu(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    DOCTORES
                                </NavLink>
                                <NavLink
                                    to="/about"
                                    onClick={() => setShowMenu(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    SOBRE NOSOTROS
                                </NavLink>
                                <NavLink
                                    to="/contact"
                                    onClick={() => setShowMenu(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    CONTACTO
                                </NavLink>
                            </ul>

                            {!token && (
                                <div className="mt-8">
                                    <button
                                        onClick={() => {
                                            navigate("/login");
                                            setShowMenu(false);
                                        }}
                                        className="w-full bg-primary text-white py-2 rounded-full hover:bg-primary/90 transition-colors"
                                    >
                                        Crear cuenta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
