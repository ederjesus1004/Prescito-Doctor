import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-6 sm:py-10">
            {/* Sección Título Principal */}
            <div className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold pt-4 sm:pt-8 lg:pt-10 text-gray-800">
                <p>
                    SOBRE <span className="text-primary">NOSOTROS</span>
                </p>
            </div>

            {/* Sección Descripción */}
            <section className="my-6 sm:my-10 lg:my-12">
                <div className="flex flex-col md:flex-row gap-6 sm:gap-10 lg:gap-12">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            className="w-full max-w-[300px] sm:max-w-[360px] rounded-lg shadow-lg object-cover"
                            src={assets.about_image}
                            alt="Sobre nosotros"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-4 sm:gap-5 lg:gap-6 md:w-1/2">
                        <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                            <p>
                                Bienvenido a <strong>Prescripto</strong>, tu socio de
                                confianza en la gestión de tus necesidades de salud de
                                manera conveniente y eficiente. En Prescripto,
                                entendemos los desafíos que enfrentan las personas al
                                programar citas médicas y gestionar sus registros de
                                salud.
                            </p>
                            <p>
                                Estamos comprometidos con la excelencia en la tecnología
                                de la salud. Nos esforzamos continuamente por mejorar
                                nuestra plataforma, integrando los últimos avances para
                                mejorar la experiencia del usuario y ofrecer un servicio
                                superior. Ya sea que estés reservando tu primera cita o
                                gestionando atención continua, Prescripto está aquí para
                                apoyarte en cada paso del camino.
                            </p>
                            <div className="pt-2">
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2">
                                    Nuestra Visión
                                </h3>
                                <p>
                                    Nuestra visión en Prescripto es crear una
                                    experiencia de atención médica sin interrupciones
                                    para cada usuario. Nuestro objetivo es cerrar la
                                    brecha entre los pacientes y los proveedores de
                                    atención médica, facilitando el acceso a la atención
                                    que necesitas, cuando la necesitas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección "Por qué elegirnos" */}
            <div className="text-center text-xl sm:text-2xl lg:text-3xl my-6 sm:my-8 lg:my-10 text-gray-800">
                <p>
                    ¿POR QUÉ{" "}
                    <span className="text-primary font-semibold">
                        ELEGIRNOS?
                    </span>
                </p>
            </div>

            {/* Sección de Características */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
                <article className="border px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center gap-3 text-gray-600 transition-all duration-300 hover:bg-primary hover:text-white rounded-lg shadow-md">
                    <h4 className="font-bold text-base sm:text-lg">EFICIENCIA</h4>
                    <p className="text-sm sm:text-base">
                        Programación de citas simplificada que se adapta a tu
                        estilo de vida ocupado.
                    </p>
                </article>
                <article className="border px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center gap-3 text-gray-600 transition-all duration-300 hover:bg-primary hover:text-white rounded-lg shadow-md">
                    <h4 className="font-bold text-base sm:text-lg">CONVENIENCIA</h4>
                    <p className="text-sm sm:text-base">
                        Acceso a una red de profesionales de la salud de
                        confianza en tu área.
                    </p>
                </article>
                <article className="border px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center gap-3 text-gray-600 transition-all duration-300 hover:bg-primary hover:text-white rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
                    <h4 className="font-bold text-base sm:text-lg">PERSONALIZACIÓN</h4>
                    <p className="text-sm sm:text-base">
                        Recomendaciones y recordatorios personalizados para
                        ayudarte a mantenerte al tanto de tu salud.
                    </p>
                </article>
            </section>

            {/* Botón CTA */}
            <div className="flex justify-center mt-6 sm:mt-10 lg:mt-12">
                <button
                    onClick={() => {
                        navigate("/contact");
                        window.scrollTo(0, 0);
                    }}
                    className="bg-primary text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 text-sm sm:text-base"
                >
                    Contáctanos
                </button>
            </div>
        </div>
    );
};

export default About;
