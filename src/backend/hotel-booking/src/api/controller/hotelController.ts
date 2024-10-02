import { Request, Response } from "express";
import { z } from "zod";
import { check_hotel_availability } from "../service/hotelService";

const URL_order_management = "http://localhost:3003/order/hotel_update";

const order_schema = z.object({
  to: z.string(),
  from: z.string(),
  room: z.string(),
});

interface hotelRequested {
  to: string;
  from: string;
  room: string;
}
let hotel_booking: hotelRequested;

export const receive_order = async (req: Request, res: Response): Promise<void> => {
  let parsedBody: any;  
  try {
      parsedBody = order_schema.parse(req.body.hotel);
    } catch (error) {
      console.error("Error parsing data: request body not valid!", error);
      res.status(400).json({ error: "Bad Request" });
      return;
    }
    try {
      hotel_booking = {
        to: parsedBody.to,
        from: parsedBody.from,
        room: parsedBody.room,
      };
      const db_response = await check_hotel_availability(hotel_booking);
      //RESPOND TO Order management
      if (db_response) { res.send("HOTELAPPROVED"); }
      else { res.send("HOTELDENIED");}  
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error parsing data: request body not valid!", error);
      return;
    }
  };
