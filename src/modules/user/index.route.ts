import express from 'express';
const app = express();

import { jwtHelper } from '../../helpers/jwt.helper';
const allowedRoles = ["user"];

import { authRoutes } from './User/routes/auth.route';

app.use(authRoutes);

export { app as userRoutes };
