import express from "express";
import {
    createContact,
    getAllContacts,
    updateContactStatus,
} from "../controllers/contactController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta pública para crear un mensaje de contacto
router.post("/", createContact);

// Rutas protegidas para admin
router.get("/", verifyAdmin, getAllContacts);
router.patch("/:id/status", verifyAdmin, updateContactStatus);

export default router; 