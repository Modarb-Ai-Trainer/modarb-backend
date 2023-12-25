import jwt from "jsonwebtoken";

export class jwtHelper {
    static generateToken(payload: any) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "secret", { expiresIn: '30d' })
    }

    static verifyToken(role: any) {
        return (req: any, res: any, next: any) => {
            let authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(" ")[1]
            if (token) {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret", (err: any, tokenData: any) => {
                    if (err) return res.status(403).json({ success: false, code: 403, message: "Invalid Token!" })
                    if (!role.includes(tokenData.role)) return res.status(401).json({ success: false, code: 401, message: "Unauthorized" })
                    req.tokenData = tokenData;
                    next();
                })
    
            } else return res.status(401).json({ success: false, code: 401, message: "Unauthorized" })
        }
    }
}