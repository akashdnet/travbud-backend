import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envList } from "./config/envList";
import globalErrorHandler from "./errors/globalErrorHandler";
import { router } from "./routes";
import notFound from "./utils/notFound";


const app = express()


app.use(cookieParser())

// Only parse JSON and URL-encoded bodies if NOT multipart/form-data
// This prevents body parsers from consuming the stream before multer
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    express.json({ limit: '50mb' })(req, res, next);
});



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

app.use(globalErrorHandler)
app.use(notFound)

export default app