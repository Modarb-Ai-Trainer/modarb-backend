export const validator = (schema: any) => {
    return (req: any, res: any, next: any) => {
        try {
            let validationResult = schema.body.validate(req.body);
            var validation = [];
            if (validationResult.error) {
                validation.push(validationResult.error.details[0].message);
            }
            if (validation.length) {
                return res.status(400).json({ success: false, error: validation.join(), code: 400 });
            }
            next();
        } catch (err) {
            console.log(`err`, err);
            return res.status(400).json({ success: false, error: "Bad Request!", code: 400 });
        }
    };
};