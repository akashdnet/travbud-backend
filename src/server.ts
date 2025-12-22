import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envList } from "./config/envList";
import { createSuperAdmin } from "./utils/seed";

let server: Server;


const startServer = async () => {
  try {

    await mongoose.connect(envList.DB_URI)
    console.log("YaY!! Connected to DB...");

    // seeds 
    await createSuperAdmin();


    // tours
    // await createMultipleTrips();

    // reviews
    // await createReviews();


    server = app.listen(envList.PORT, () => {
      console.log(`Server  is successfully listening to port http://localhost:${envList.PORT}`);
    });



  } catch (error) {
    console.log(error);
  }
}

startServer()




process.on("SIGTERM", () => {
  console.log("SIGTERM signal detected. Server shutting down.");

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})




process.on("SIGINT", () => {
  console.log("SIGINT signal detected. server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})




process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected. server shutting down.", err);

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})



process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected. Server shutting down.", err);

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})
