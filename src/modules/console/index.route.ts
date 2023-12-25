import express from 'express';
const app = express();

import { jwtHelper } from '../../helpers/jwt.helper';
const allowedRoles = ["superAdmin", "admin"];

import { adminUserRoutes } from './User/routes/admin.userRoute';

app.use("/users", jwtHelper.verifyToken(allowedRoles), adminUserRoutes);

export { app as adminRoutes };
