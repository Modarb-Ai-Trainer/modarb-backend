import express from 'express';
const app = express.Router();

import { userRoutes } from './modules/user/index.route';
import { adminRoutes } from './modules/console/index.route';

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);


app.get("/", (req: any, res: any) => {
    res.status(200).json({ success: true, message: 'Welcome Message', code: 200 })
})

app.get("*", (req: any, res: any) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

app.post("*", (req: any, res: any) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

app.put("*", (req: any, res: any) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})

app.delete("*", (req: any, res: any) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})


app.patch("*", (req: any, res: any) => {
    res.status(404).json({ success: false, message: "Invalid URL!", code: 404 })
})



export { app as routes };