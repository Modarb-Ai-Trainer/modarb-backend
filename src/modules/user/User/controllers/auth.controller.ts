import { userService } from "../services/user.service";
import { jwtHelper } from "../../../../helpers/jwt.helper";

export class authController {

    static async register(req, res) {
        try {
            let result = await userService.create(req.body);
            return res.status(result.code).json(result);
        } catch (err) {
            console.log(`err.message`, err.message);
            return res.status(500).json({
                success: false,
                code: 500,
                error: err.message
            })
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            let result: { success: boolean; code: number; record?: any; message?: string } = await userService.comparePassword(email, password);
            if (!result.success) return res.status(result.code).json(result);
            let payload = {
                _id: result.record?._id, name: result.record?.name,
                email: result.record?.email,
                number: result.record?.number,
                role: result.record?.role
            }
            const token = jwtHelper.generateToken(payload);
            return res.status(result.code).json({
                success: result.success,
                token,
                code: result.code,
                record: result.record
            })
        } catch (err) {
            console.log(`err.message`, err.message);
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}