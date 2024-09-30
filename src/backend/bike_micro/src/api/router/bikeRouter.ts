import express, { Router } from "express";
import { receive_order, revert_order } from "../controllers/bikeControllers";

export const app = express();

app.use(express.json())

const BikeRouter = Router();

/*TODO these function can be implemented using RABBITMQ and not GET and POST */

//BikeRouter.get("/confirm_request", handler_confirm_request);
//console.log("[INFO] Set up confirm_request route...");

BikeRouter.post("/send_data", receive_order);
console.log("[INFO] Set up send_data route...");

BikeRouter.post("/revert_order", revert_order);
console.log("[INFO] Set up revert_order route...");

//BikeRouter.post("/bike_shop_update", handler_bike_shop_update)
//console.log("[INFO] Set up bike_shop_update route...");
export { BikeRouter };