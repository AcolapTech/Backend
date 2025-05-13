import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: `Autorización denegada, no token` });
    }

    // Verificación del token
    try {
        const decoded = jwt.verify(token, process.env.SK_JWT);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error de token:', err);
        return res.status(403).json({ message: 'Autorización denegada: token inválido' });
    }
};


export default auth;

