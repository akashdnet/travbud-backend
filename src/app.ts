import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import globalErrorHandler from "./errors/globalErrorHandler";
import { logger } from "./middlewares/logger";
import { router } from "./routes";
import notFound from "./utils/notFound";


const app = express()


app.use(cookieParser())




app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));





app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use(logger);

app.use("/api/v1", router)



app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TravBud Backend"
    })
})




app.use(globalErrorHandler)
app.use(notFound)

export default app