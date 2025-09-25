import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <div className="flex flex-col items-center gap-6 my-16 text-[#262626] md:mx-10 pb-12">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold">
                Los Mejores Doctores para Reservar
            </h1>

            <p className="text-sm sm:text-base md:text-base text-gray-600 max-w-2xl mx-auto text-center mb-8">
                Descubre nuestra selección de doctores calificados y encuentra
                el que mejor se adapte a tus necesidades.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${item._id}`);
                            scrollTo(0, 0);
                        }}
                        className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                        key={index}
                    >
                        <div className="w-full aspect-square bg-[#EAEFFF]">
                            <img 
                                className="w-full h-full object-cover object-center" 
                                src={item.image} 
                                alt={item.name}
                            />
                        </div>
                        <div className="p-4">
                            <div
                                className={`flex items-center gap-2 text-sm text-center ${
                                    item.available
                                        ? "text-green-500"
                                        : "text-gray-500"
                                }`}
                            >
                                <p
                                    className={`w-2 h-2 rounded-full ${
                                        item.available
                                            ? "bg-green-500"
                                            : "bg-gray-500"
                                    }`}
                                ></p>
                                <p>
                                    {item.available
                                        ? "Disponible"
                                        : "No Disponible"}
                                </p>
                            </div>
                            <p className="text-[#262626] text-lg font-medium">
                                {item.name}
                            </p>
                            <p className="text-[#5C5C5C] text-sm">
                                {item.speciality}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center w-full mt-7">
                <div className="flex-grow border-t border-gray-300"></div>
                <button
                    onClick={() => {
                        navigate("/doctors");
                        scrollTo(0, 0);
                    }}
                    className="bg-[#EAEFFF] text-gray-600 px-12 py-3 mx-4 rounded-full shadow-md hover:bg-primary hover:text-white transition duration-300"
                >
                    Ver más doctores
                </button>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
        </div>
    );
};

export default TopDoctors;
