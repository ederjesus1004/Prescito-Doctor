import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <div className="mx-4 md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <div className="flex flex-col items-start">
                    <img
                        className="mb-5 w-40"
                        src={assets.logo}
                        alt="Logo de la empresa"
                    />
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">
                        En Prescripto, nuestro compromiso es brindar atención
                        médica de calidad y soluciones efectivas para la salud
                        de nuestros pacientes. Contamos con un equipo de
                        profesionales altamente capacitados y tecnología de
                        vanguardia para garantizar el bienestar de quienes
                        confían en nosotros.
                    </p>
                </div>

                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800">
                        EMPRESA
                    </p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li className="hover:text-blue-500 cursor-pointer">
                            Inicio
                        </li>
                        <li className="hover:text-blue-500 cursor-pointer">
                            Sobre nosotros
                        </li>
                        <li className="hover:text-blue-500 cursor-pointer">
                            Entrega
                        </li>
                        <li className="hover:text-blue-500 cursor-pointer">
                            Política de privacidad
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800">
                        CONTACTO
                    </p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li className="hover:text-blue-500 cursor-pointer">
                            +1-212-456-7890
                        </li>
                        <li className="hover:text-blue-500 cursor-pointer">
                            correoprueba@gmail.com
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <hr className="border-gray-300" />
                <p className="py-5 text-sm text-center text-gray-500">
                    Copyright 2024 @ GrupoUTP.com - Todos los derechos
                    reservados.
                </p>
            </div>
        </div>
    );
};

export default Footer;
