import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const appointmentId = searchParams.get("appointmentId");
    const paypalToken = searchParams.get("token");

    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            // Si el usuario canceló o regresó sin pagar
            if (success === "false" || success === null) {
                if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                        type: 'PAYMENT_FAILED',
                        appointmentId: appointmentId,
                        success: false
                    }, '*');
                }
                toast.error("Pago cancelado o no completado");
                setTimeout(() => {
                    window.close();
                }, 500);
                return;
            }

            const endpoint = paypalToken ? "/api/user/verifyPaypal" : "/api/user/verifyStripe";
            
            const { data } = await axios.post(
                backendUrl + endpoint,
                { 
                    success, 
                    appointmentId,
                    token: paypalToken
                },
                { 
                    headers: { 
                        token: localStorage.getItem("token"),
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (data.success && success === "true") {
                if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                        type: 'PAYMENT_COMPLETED',
                        appointmentId: appointmentId,
                        success: true
                    }, '*');
                }
                setTimeout(() => {
                    window.close();
                }, 500);
                toast.success(data.message || "Pago procesado exitosamente");
            } else {
                if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                        type: 'PAYMENT_FAILED',
                        appointmentId: appointmentId,
                        success: false
                    }, '*');
                }
                toast.error(data.message || "Error al procesar el pago");
                setTimeout(() => {
                    window.close();
                }, 500);
            }
        } catch (error) {
            console.error("Error en la verificación del pago:", error);
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'PAYMENT_ERROR',
                    appointmentId: appointmentId,
                    success: false
                }, '*');
            }
            toast.error(error.response?.data?.message || error.message || "Error al verificar el pago");
            setTimeout(() => {
                window.close();
            }, 500);
        }
    };

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if (!userToken) {
            toast.error("Sesión no válida");
            return navigate("/login");
        }

        if (appointmentId) {
            verifyPayment();
        }
    }, [appointmentId]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Verificando el pago...</p>
        </div>
    );
}

export default Verify;
