import Contact from "../models/contactModel.js";

// Crear un nuevo mensaje de contacto
export const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                message: "Por favor complete todos los campos requeridos",
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Mensaje enviado exitosamente",
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al enviar el mensaje",
            error: error.message,
        });
    }
};

// Obtener todos los mensajes de contacto (para el admin)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los mensajes",
            error: error.message,
        });
    }
};

// Actualizar el estado de un mensaje
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Mensaje no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Estado actualizado exitosamente",
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el estado",
            error: error.message,
        });
    }
}; 