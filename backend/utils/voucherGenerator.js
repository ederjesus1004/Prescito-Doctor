import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Función para formatear la fecha
const formatearFecha = (fechaStr) => {
    const [dia, mes, año] = fechaStr.split('_');
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${dia} de ${meses[parseInt(mes) - 1]} del ${año}`;
};

export const generateVoucher = async (appointmentData) => {
    const doc = new PDFDocument({
        size: "A4",
        margin: 40,
    });

    const filePath = path.join("temp", `voucher-${appointmentData._id}.pdf`);

    if (!fs.existsSync("temp")) {
        fs.mkdirSync("temp");
    }

    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Agregar un borde decorativo
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke(
            "#1E88E5"
        );

        // Encabezado con estilo
        doc.fontSize(24)
            .fillColor("#1E88E5")
            .text("PRESCRIPTO", { align: "center" });

        doc.fontSize(16)
            .fillColor("#333333")
            .text("Comprobante de Pago", { align: "center" });

        doc.moveDown();

        // Línea divisoria
        doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#E0E0E0");

        doc.moveDown();

        // Función helper para secciones
        const addSection = (title, content) => {
            doc.fontSize(11)
                .fillColor("#1E88E5")
                .text(title, { continued: true })
                .fillColor("#333333")
                .text(": " + content);
            doc.moveDown(0.5);
        };

        // Información del paciente con mejor formato
        doc.fontSize(13)
            .fillColor("#1E88E5")
            .text("Información del Paciente", { underline: true });
        doc.moveDown(0.5);

        addSection("Paciente", appointmentData.userData.name);
        addSection("Email", appointmentData.userData.email);

        doc.moveDown(0.5);

        // Información del doctor
        doc.fontSize(13)
            .fillColor("#1E88E5")
            .text("Información del Médico", { underline: true });
        doc.moveDown(0.5);

        addSection("Doctor", appointmentData.docData.name);
        addSection("Especialidad", appointmentData.docData.speciality);

        doc.moveDown(0.5);

        // Detalles de la cita
        doc.fontSize(13)
            .fillColor("#1E88E5")
            .text("Detalles de la Cita", { underline: true });
        doc.moveDown(0.5);

        const fechaFormateada = formatearFecha(appointmentData.slotDate);
        addSection("Fecha", fechaFormateada);
        addSection("Hora", appointmentData.slotTime);

        doc.moveDown(0.5);

        // Información del pago con un cuadro
        doc.rect(50, doc.y, doc.page.width - 100, 80).fillAndStroke(
            "#F5F5F5",
            "#1E88E5"
        );

        doc.y += 15;

        doc.fontSize(13)
            .fillColor("#1E88E5")
            .text("Detalles del Pago", { align: "center" });

        doc.y += 5;

        doc.fontSize(11)
            .fillColor("#333333")
            .text(`Monto pagado: S/. ${appointmentData.amount}`, {
                align: "center",
            });
        doc.text(`Fecha de pago: ${new Date().toLocaleDateString("es-PE")}`, {
            align: "center",
        });
        doc.text(`ID de transacción: ${appointmentData._id}`, {
            align: "center",
        });

        // Pie de página (ajustado para que quede en la misma página)
        doc.fontSize(9)
            .fillColor("#666666")
            .text(
                "Este es un comprobante electrónico generado automáticamente.",
                50,
                doc.page.height - 60,
                { align: "center" }
            );

        doc.end();

        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
};

export const sendVoucherByEmail = async (email, filePath, appointmentData) => {
    const fechaFormateada = formatearFecha(appointmentData.slotDate);

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Roboto', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f3f4f6;
                    margin: 0;
                    padding: 0;
                    max-width: 800px;
                    margin: 20px auto;
                }

                .header {
                    background-color: #1E88E5;
                    color: white;
                    padding: 25px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    letter-spacing: 1px;
                }

                .header p {
                    margin: 5px 0 0;
                    font-size: 16px;
                    font-weight: 300;
                }

                .content {
                    padding: 25px;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 0 0 8px 8px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                }

                .appointment-details {
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 5px solid #1E88E5;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                }

                .appointment-details h3 {
                    margin-top: 0;
                    font-size: 20px;
                    color: #1E88E5;
                }

                .appointment-details p {
                    margin: 5px 0;
                    font-size: 16px;
                }

                ul {
                    padding-left: 20px;
                    margin: 10px 0;
                }

                ul li {
                    margin-bottom: 10px;
                }

                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding: 20px;
                    font-size: 12px;
                    color: #666;
                }

                .footer p {
                    margin: 5px 0;
                }

                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #1E88E5;
                    color: white;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 8px;
                    transition: background-color 0.3s ease;
                }

                .button:hover {
                    background-color: #1565C0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>PRESCRIPTO</h1>
                <p>Comprobante de Pago</p>
            </div>
            
            <div class="content">
                <p>Estimado/a <strong>${appointmentData.userData.name}</strong>,</p>
                
                <p>¡Gracias por confiar en nosotros! Su pago ha sido procesado exitosamente.</p>
                
                <div class="appointment-details">
                    <h3>Detalles de su Cita Médica:</h3>
                    <p><strong>Doctor:</strong> ${appointmentData.docData.name}</p>
                    <p><strong>Especialidad:</strong> ${appointmentData.docData.speciality}</p>
                    <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                    <p><strong>Hora:</strong> ${appointmentData.slotTime}</p>
                    <p><strong>Monto:</strong> S/. ${appointmentData.amount}</p>
                </div>
                
                <p>Adjunto encontrará su comprobante de pago en formato PDF.</p>
                
                <p>Recomendaciones importantes:</p>
                <ul>
                    <li>Llegue 15 minutos antes de su cita</li>
                    <li>Traiga su documento de identidad</li>
                    <li>Si necesita cancelar su cita, hágalo con 24 horas de anticipación</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                <p>© 2023 Prescripto. Todos los derechos reservados.</p>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Comprobante de Pago - Prescripto",
        html: htmlContent,
        attachments: [
            {
                filename: "comprobante.pdf",
                path: filePath,
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

export const cleanupTempFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error("Error al eliminar archivo temporal:", err);
    });
};
