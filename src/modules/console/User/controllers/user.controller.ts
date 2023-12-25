import { userService } from "../services/user.service";

export class adminUserController {

    static async create(req, res) {
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
}