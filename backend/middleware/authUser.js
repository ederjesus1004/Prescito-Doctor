import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No autorizado, token no proporcionado"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded.id) {
                return res.status(401).json({
                    success: false,
                    message: "Token inválido o malformado"
                });
            }
            req.body.userId = decoded.id;
            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Sesión expirada, por favor inicie sesión nuevamente"
                });
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Token inválido, por favor inicie sesión nuevamente"
                });
            }
            throw jwtError;
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(500).json({
            success: false,
            message: "Error en la autenticación",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default authUser;
