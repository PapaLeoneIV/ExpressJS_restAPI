import express, { Router } from "express";
import { handler_book_vacation, handler_payment_update, handler_hotel_update, handler_bike_update } from "../service/orderService";

export const app = express();

const OrderRouter = Router();


/**TODO these function can be implemented using RABBITMQ and not GET and POST */
OrderRouter.get("book_vacation", handler_book_vacation);
console.log("[INFO] Set up handler_book_vacation...")
OrderRouter.post("payment_update", handler_payment_update );
console.log("[INFO] Set up handler_book_vacation...")
OrderRouter.post("hotel_update", handler_hotel_update);
console.log("[INFO] Set up handler_book_vacation...")
OrderRouter.post("bike_update", handler_bike_update);
console.log("[INFO] Set up handler_book_vacation...")





export { OrderRouter };
