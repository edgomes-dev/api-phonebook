import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";

config();

import router from "./routes/contactRoutes";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

const allowedOrigins = "*";
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  allowedHeaders: "*",
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(options));

app.use(express.json());
app.use("/api", router);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const port = 3333;
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@apicluster.qdshx.mongodb.net/bancodaapi?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectou ao mongoDB");
    app.listen(port, () => console.log(`servidor rodando na porta ${port}`));
  });
