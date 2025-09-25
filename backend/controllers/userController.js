import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import stripe from "stripe";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import { generateVoucher, sendVoucherByEmail, cleanupTempFile } from "../utils/voucherGenerator.js";

dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

// Configuración de PayPal
const paypalClient = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    )
);

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Detalles faltantes"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Por favor ingrese un correo electrónico válido"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 8 caracteres"
            });
        }

        // Verificar si el email ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Este correo electrónico ya está registrado"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ 
            success: true, 
            token,
            message: "Usuario registrado exitosamente" 
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error al registrar usuario",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "El usuario no existe",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Credenciales inválidas" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select("-password");

        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Datos faltantes" });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(
                imageFile.path,
                {
                    resource_type: "image",
                }
            );
            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.json({ success: true, message: "Perfil actualizado" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos para la reserva"
            });
        }

        // Verificar si ya existe una cita para este usuario en la misma fecha y hora
        const existingAppointment = await appointmentModel.findOne({
            userId,
            docId,
            slotDate,
            slotTime,
            cancelled: { $ne: true }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "Ya tienes una cita reservada para esta fecha y hora"
            });
        }

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor no encontrado"
            });
        }

        if (!docData.available) {
            return res.status(400).json({
                success: false,
                message: "Doctor no disponible"
            });
        }

        // Verificar nuevamente la disponibilidad del slot
        let slots_booked = docData.slots_booked;
        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.status(400).json({
                success: false,
                message: "Este horario ya no está disponible"
            });
        }

        // Actualizar slots_booked de manera segura
        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = [];
        }
        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select("-password");

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: {
                _id: docData._id,
                name: docData.name,
                email: docData.email,
                phone: docData.phone,
                speciality: docData.speciality,
                experience: docData.experience,
                fees: docData.fees,
                address: docData.address,
                image: docData.image
            },
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        // Usar una transacción para garantizar la integridad de los datos
        const session = await appointmentModel.startSession();
        try {
            await session.withTransaction(async () => {
                const newAppointment = new appointmentModel(appointmentData);
                await newAppointment.save({ session });
                await doctorModel.findByIdAndUpdate(
                    docId,
                    { slots_booked },
                    { session }
                );
            });
            await session.endSession();

            res.status(201).json({
                success: true,
                message: "Cita reservada exitosamente"
            });
        } catch (transactionError) {
            await session.endSession();
            throw transactionError;
        }
    } catch (error) {
        console.error('Error al reservar cita:', error);
        res.status(500).json({
            success: false,
            message: "Error al reservar la cita",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData.userId !== userId) {
            return res.json({
                success: false,
                message: "Acción no autorizada",
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(
            (e) => e !== slotTime
        );

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Cita cancelada" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Cita cancelada o no encontrada",
            });
        }

        const currency = process.env.CURRENCY.toLowerCase();

        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: "Honorarios de la cita",
                    },
                    unit_amount: appointmentData.amount * 100,
                },
                quantity: 1,
            },
        ];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyStripe = async (req, res) => {
    try {
        const { success, appointmentId } = req.body;

        if (success) {
            const appointmentData = await appointmentModel.findByIdAndUpdate(
                appointmentId,
                { payment: true },
                { new: true }
            ).populate('userData').populate('docData');

            // Generar y enviar el voucher
            try {
                const voucherPath = await generateVoucher(appointmentData);
                await sendVoucherByEmail(
                    appointmentData.userData.email,
                    voucherPath,
                    appointmentData
                );
                cleanupTempFile(voucherPath);
            } catch (error) {
                console.error('Error al generar/enviar el voucher:', error);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const paymentPaypal = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;

        if (!appointmentId || !origin) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos para procesar el pago"
            });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Cita no encontrada"
            });
        }

        if (appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: "La cita ha sido cancelada"
            });
        }

        if (appointmentData.payment) {
            return res.status(400).json({
                success: false,
                message: "Esta cita ya ha sido pagada"
            });
        }

        if (appointmentData.userId !== req.body.userId) {
            return res.status(403).json({
                success: false,
                message: "No autorizado para pagar esta cita"
            });
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: process.env.CURRENCY,
                        value: appointmentData.amount.toString(),
                    },
                    description: `Cita médica con Dr. ${appointmentData.docData.name}`,
                },
            ],
            application_context: {
                brand_name: "Prescripto",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${origin}/verify?appointmentId=${appointmentId}&success=true`,
                cancel_url: `${origin}/verify?appointmentId=${appointmentId}&success=false`,
            },
        });

        try {
            const order = await paypalClient.execute(request);
            if (order.statusCode === 201) {
                const approvalLink = order.result.links.find(
                    (link) => link.rel === "approve"
                ).href;

                return res.json({ success: true, approvalLink });
            }
            throw new Error("Error al crear la orden en PayPal");
        } catch (paypalError) {
            console.error("Error de PayPal:", paypalError);
            return res.status(500).json({
                success: false,
                message: "Error al procesar el pago con PayPal",
                error: process.env.NODE_ENV === 'development' ? paypalError.message : undefined
            });
        }
    } catch (error) {
        console.error("Error general:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const verifyPaypal = async (req, res) => {
    try {
        const { success, appointmentId, token } = req.body;

        if (!appointmentId || !token) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos para verificar el pago"
            });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Cita no encontrada"
            });
        }

        if (appointmentData.payment) {
            return res.status(400).json({
                success: false,
                message: "Esta cita ya ha sido pagada"
            });
        }

        if (success === "true" || success === true) {
            try {
                const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
                captureRequest.requestBody({});
                
                const captureResponse = await paypalClient.execute(captureRequest);
                
                if (captureResponse.statusCode === 201) {
                    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
                        appointmentId,
                        { payment: true },
                        { new: true }
                    ).populate('userData').populate('docData');

                    // Generar y enviar el voucher
                    try {
                        const voucherPath = await generateVoucher(updatedAppointment);
                        await sendVoucherByEmail(
                            updatedAppointment.userData.email,
                            voucherPath,
                            updatedAppointment
                        );
                        cleanupTempFile(voucherPath);
                    } catch (voucherError) {
                        console.error('Error al generar/enviar el voucher:', voucherError);
                        // No detenemos el proceso por un error en el voucher
                    }

                    return res.json({
                        success: true,
                        message: "Pago verificado y procesado exitosamente"
                    });
                }
                
                throw new Error("Error al capturar el pago en PayPal");
            } catch (paypalError) {
                console.error("Error de PayPal en la verificación:", paypalError);
                return res.status(500).json({
                    success: false,
                    message: "Error al verificar el pago con PayPal",
                    error: process.env.NODE_ENV === 'development' ? paypalError.message : undefined
                });
            }
        }

        return res.json({
            success: false,
            message: "Pago no completado o cancelado"
        });
    } catch (error) {
        console.error("Error general en verificación:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentStripe,
    verifyStripe,
    paymentPaypal,
    verifyPaypal,
};
