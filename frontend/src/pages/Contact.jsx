import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const schema = yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    email: yup
        .string()
        .email("Ingrese un email válido")
        .required("El email es requerido"),
    phone: yup
        .string()
        .matches(/^[0-9]+$/, "Ingrese solo números")
        .min(9, "El número debe tener al menos 9 dígitos")
        .required("El teléfono es requerido"),
    subject: yup.string().required("El asunto es requerido"),
    message: yup
        .string()
        .min(10, "El mensaje debe tener al menos 10 caracteres")
        .required("El mensaje es requerido"),
});

const Contact = () => {
    const { backendUrl } = useContext(AppContext);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${backendUrl}/api/contact`, data);
            toast.success(response.data.message);
            reset();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error al enviar el mensaje"
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                    Contáctanos
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                    Estamos aquí para ayudarte. Envíanos tu mensaje y te
                    responderemos lo antes posible.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Información de contacto */}
                <div className="bg-white rounded-2xl p-8 lg:p-12">
                    <img
                        className="w-full rounded-2xl shadow-lg mb-8 object-cover h-[400px]"
                        src={assets.contact_image}
                        alt="Contacto"
                    />
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Nuestra Oficina
                            </h3>
                            <p className="text-lg text-gray-600">
                                Av. José Larco 1234
                                <br />
                                Miraflores, Lima, Perú
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Información de Contacto
                            </h3>
                            <p className="text-lg text-gray-600">
                                Tel: (01) 555-0132
                                <br />
                                Email: correopruebav@gmail.com
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Horario de Atención
                            </h3>
                            <p className="text-lg text-gray-600">
                                Lunes a Viernes: 9:00 AM - 6:00 PM
                                <br />
                                Sábados: 9:00 AM - 1:00 PM
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulario de contacto */}
                <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register("name")}
                                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-200"
                                placeholder="Ingresa tu nombre completo"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-200"
                                placeholder="ejemplo@correo.com"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                {...register("phone")}
                                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-200"
                                placeholder="Ingresa tu número de teléfono"
                            />
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Asunto
                            </label>
                            <input
                                type="text"
                                id="subject"
                                {...register("subject")}
                                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-200"
                                placeholder="¿Sobre qué nos quieres contactar?"
                            />
                            {errors.subject && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.subject.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                {...register("message")}
                                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-200 resize-none"
                                placeholder="Escribe tu mensaje aquí..."
                            />
                            {errors.message && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg font-medium text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
