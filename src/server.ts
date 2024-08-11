import mongoose from "mongoose";
import app from "./app";
import config from "./config";

const main = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL as string, {
      dbName: config.DATABASE_NAME,
    });

    app.listen(config.PORT, () => {
      console.log(`app is listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log("from server file", error);
  }
};
main();
