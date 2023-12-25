import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { routes } from "../index.route";
import { connection as databaseConnection } from "./database";

databaseConnection();
export const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
