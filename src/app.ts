import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envList } from "./config/envList";
import globalErrorHandler from "./errors/globalErrorHandler";
import { multerErrorHandler } from "./middlewares/multerErrorHandler";
import { router } from "./routes";
import notFound from "./utils/notFound";


const app = express()


app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
    origin: envList.FRONT_END_SITE,
    credentials: true
}));



app.use("/api/v1", router)



app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TravBud Backend"
    })
})



// Multer error handler must come before global error handler
app.use(multerErrorHandler)
app.use(globalErrorHandler)
app.use(notFound)

export default app