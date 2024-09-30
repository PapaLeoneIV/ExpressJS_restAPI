import { Request, Response } from "express";
import { z } from "zod";
import {
  check_bikes_availability,
  revert_bike_order,
} from "../service/bikeService";

const URL_order_management = "http://localhost:3003/order/bike_update";

const order_schema = z.object({
  road: z.string(),
  dirt: z.string(),
});

interface BikeRequested {
  road: string;
  dirt: string;
}
let bike_requested: BikeRequested;

export const receive_order = async (
  req: Request,
  res: Response
): Promise<void> => {
  //PARSE DATA
  let parsedBody: any;
  try {
    parsedBody = order_schema.parse(req.body.bikes);
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
    console.log("Error parsing data: request body not valid!", error);
    return;
  }
  try {
    console.log("Data received:", parsedBody);
    bike_requested = {
      road: parsedBody.road,
      dirt: parsedBody.dirt,
    };
    const db_response = await check_bikes_availability(bike_requested);
    //RESPOND TO Order Management
    if (db_response) {
      res.send("BIKEAPPROVED");
    } else {
      res.send("BIKEDENIED");
    }
  } catch (error) {
    console.log("Error parsing data: request body not valid!", error);
    res.status(400).json({ error: "Bad Request" });
    return;
  }
};

export const revert_order = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Reverting order...");
  let parsedBody: any;
  try {
    parsedBody = order_schema.parse(req.body.bikes);
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
    console.log("Error parsing data: request body not valid!", error);
    return;
  }
  try {
    console.log("Data received:", parsedBody);
    bike_requested = {
      road: parsedBody.road,
      dirt: parsedBody.dirt,
    };
    const db_response = await revert_bike_order(bike_requested);
    //RESPOND TO Order Management
    if (db_response) {
      res.send("BIKEORDERREVERTED");
    } else {
      res.send("BIKEORDERNOTREVERTED");
    }
  } catch (error) {
    console.log("Error parsing data: request body not valid!", error);
    res.status(400).json({ error: "Bad Request" });
    return;
  }
};