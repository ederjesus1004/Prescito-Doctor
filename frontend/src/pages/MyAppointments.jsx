import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import PaymentModal from "../components/PaymentModal";

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [payment, setPayment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [isPaypalModalOpen, setIsPaypalModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const months = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return "";
        
        const dateArray = slotDate.split("_");
        const [day, month, year] = dateArray;
        
        if (!day || !month || !year) return "";
        
        const monthIndex = Number(month) - 1;
        if (monthIndex < 0 || monthIndex >= months.length) return "";
        
        return `${day} ${months[monthIndex]} ${year}`;
    };

    const handlePaymentClick = (appointmentId) => {
        setSelectedAppointment(appointmentId);
        setPayment(appointmentId);
    };

    const handleStripeClick = async () => {
        if (selectedAppointment) {
            setIsStripeModalOpen(true);
            await appointmentStripe(selectedAppointment);
        }
    };

    const handlePaypalClick = async () => {
        if (selectedAppointment) {
            setIsPaypalModalOpen(true);
            await appointmentPaypal(selectedAppointment);
        }
    };

    const closeModals = () => {
        setIsStripeModalOpen(false);
        setIsPaypalModalOpen(false);
        setSelectedAppointment(null);
        setPayment("");
    };

    const getUserAppointments = async (showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }
        try {
            const { data } = await axios.get(
                backendUrl + "/api/user/appointments",
                {
                    headers: { token },
                }
            );
            setAppointments(data.appointments.reverse());
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/cancel-appointment",
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/payment-stripe",
                { appointmentId },
                { headers: { token } }
            );
            if (data.success) {
                const { session_url } = data;
                const width = 800;
                const height = 600;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2 - 100;
                window.open(
                    session_url,
                    'stripe_window',
                    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
                );
            } else {
                toast.error(data.message);
                closeModals();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            closeModals();
        }
    };

    const appointmentPaypal = async (appointmentId) => {
        try {
            if (!token) {
                toast.error("Por favor inicie sesión para realizar el pago");
                return navigate("/login");
            }

            if (!appointmentId) {
                toast.error("ID de cita no válido");
                return;
            }

            const { data } = await axios.post(
                backendUrl + "/api/user/payment-paypal",
                { appointmentId },
                { headers: { token } }
            );

            if (data.success && data.approvalLink) {
                const width = 800;
                const height = 600;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2 - 100;
                window.open(
                    data.approvalLink,
                    'paypal_window',
                    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
                );
            } else {
                toast.error(data.message || "Error al iniciar el pago con PayPal");
                closeModals();
            }
        } catch (error) {
            console.error("Error en PayPal:", error);
            if (error.response?.status === 401) {
                toast.error("Sesión expirada, por favor inicie sesión nuevamente");
                navigate("/login");
            } else {
                toast.error(error.response?.data?.message || "Error al procesar el pago con PayPal");
            }
            closeModals();
        }
    };

    useEffect(() => {
        const handlePaymentMessage = async (event) => {
            if (!event.data || !event.data.type) return;

            switch (event.data.type) {
                case 'PAYMENT_COMPLETED':
                    if (event.data.success) {
                        closeModals();
                        await getUserAppointments(false);
                        toast.success("¡Pago completado con éxito!", {
                            autoClose: 3000,
                            hideProgressBar: false,
                        });
                    }
                    break;
                case 'PAYMENT_FAILED':
                    closeModals();
                    toast.error("El pago no se completó", {
                        autoClose: 3000,
                        hideProgressBar: false,
                    });
                    break;
                case 'PAYMENT_ERROR':
                    closeModals();
                    toast.error("Error al procesar el pago", {
                        autoClose: 3000,
                        hideProgressBar: false,
                    });
                    break;
            }
        };

        window.addEventListener('message', handlePaymentMessage);

        return () => {
            window.removeEventListener('message', handlePaymentMessage);
        };
    }, []);

    useEffect(() => {
        if (token) {
            getUserAppointments(true);
        }
    }, [token]);

    return (
        <div>
            <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
                Mis citas
            </p>
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-400">Cargando citas...</div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-gray-400 text-lg mb-4">
                        No tienes citas programadas
                    </div>
                    <div className="text-sm text-gray-500">
                        Programa una cita con nuestros profesionales de la salud
                    </div>
                </div>
            ) : (
                <div className="">
                    {appointments.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
                        >
                            <div>
                                <img
                                    className="w-36 bg-[#EAEFFF]"
                                    src={item.docData.image}
                                    alt=""
                                />
                            </div>
                            <div className="flex-1 text-sm text-[#5E5E5E]">
                                <p className="text-[#262626] text-base font-semibold">
                                    {item.docData.name}
                                </p>
                                <p>{item.docData.speciality}</p>
                                <p className="text-[#464646] font-medium mt-1">
                                    Dirección:
                                </p>
                                <p className="">{item.docData.address.line1}</p>
                                <p className="">{item.docData.address.line2}</p>
                                <p className="mt-1">
                                    <span className="text-sm text-[#3C3C3C] font-medium">
                                        Fecha y Hora:
                                    </span>{" "}
                                    {slotDateFormat(item.slotDate)} |{" "}
                                    {item.slotTime}
                                </p>
                            </div>
                            <div></div>
                            <div className="flex flex-col gap-2 justify-end text-sm text-center">
                                {!item.cancelled &&
                                    !item.payment &&
                                    !item.isCompleted &&
                                    payment !== item._id && (
                                        <button
                                            onClick={() => handlePaymentClick(item._id)}
                                            className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                                        >
                                            Pagar en línea
                                        </button>
                                    )}
                                {!item.cancelled &&
                                    !item.payment &&
                                    !item.isCompleted &&
                                    payment === item._id && (
                                        <>
                                            <button
                                                onClick={handleStripeClick}
                                                className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                                            >
                                                <img
                                                    className="max-w-20 max-h-5"
                                                    src={assets.stripe_logo}
                                                    alt=""
                                                />
                                            </button>
                                            <button
                                                onClick={handlePaypalClick}
                                                className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                                            >
                                                <img
                                                    className="max-w-20 max-h-5"
                                                    src={assets.paypal_logo}
                                                    alt=""
                                                />
                                            </button>
                                        </>
                                    )}
                                {!item.cancelled &&
                                    item.payment &&
                                    !item.isCompleted && (
                                        <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">
                                            Pagado
                                        </button>
                                    )}

                                {item.isCompleted && (
                                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                                        Completado
                                    </button>
                                )}

                                {!item.cancelled && !item.isCompleted && (
                                    <button
                                        onClick={() => cancelAppointment(item._id)}
                                        className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                                    >
                                        Cancelar cita
                                    </button>
                                )}
                                {item.cancelled && !item.isCompleted && (
                                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                                        Cita cancelada
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stripe Modal */}
            <PaymentModal
                isOpen={isStripeModalOpen}
                onClose={closeModals}
                title="Pago con Stripe"
            >
                <button
                    onClick={() => appointmentStripe(selectedAppointment)}
                    className="mt-4 w-full sm:w-auto bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                    <img
                        src={assets.stripe_logo}
                        alt="Stripe"
                        className="h-5 sm:h-6"
                    />
                    <span>Continuar con Stripe</span>
                </button>
            </PaymentModal>

            {/* PayPal Modal */}
            <PaymentModal
                isOpen={isPaypalModalOpen}
                onClose={closeModals}
                title="Pago con PayPal"
            >
                <button
                    onClick={() => appointmentPaypal(selectedAppointment)}
                    className="mt-4 w-full sm:w-auto bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                    <img
                        src={assets.paypal_logo}
                        alt="PayPal"
                        className="h-5 sm:h-6"
                    />
                    <span>Continuar con PayPal</span>
                </button>
            </PaymentModal>
        </div>
    );
};

export default MyAppointments;
