import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
    return (
        <div
            id="speciality"
            className="container mx-auto px-4 py-16 text-gray-800 mt-5"
        >
            <div className="max-w-4xl mx-auto text-center mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold">
                    Buscar por Especialidad
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto mt-4">
                    Simplemente navega a través de nuestra extensa lista de
                    médicos de confianza, programa tu cita sin complicaciones.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-15">
                {specialityData.map((item, index) => (
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        className="group flex flex-col items-center text-center w-24 md:w-32 transition-all duration-300 ease-in-out transform hover:-translate-y-2"
                        key={index}
                    >
                        <div className="bg-white p-4 rounded-full shadow-md mb-3 group-hover:shadow-lg transition-shadow duration-300">
                            <img
                                className="w-16 md:w-20 h-16 md:h-20 object-contain"
                                src={item.image}
                                alt={item.speciality}
                            />
                        </div>
                        <p className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300">
                            {item.speciality}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SpecialityMenu;
