import { Request, Response } from "express";
import { z } from "zod";
import {
  HotelOrdersManager, 
  HotelDBManager,
  hotel_order,
} from "../service/hotelService"


const send_data_schema = z.object({
    order_id : z.string(),
    from: z.string(),
    to: z.string(),
    room: z.string(),
  
});

const revert_data_schema = z.object({
    order_id: z.string(),
  });

const parseOrderWithDefaults = (data: any, schema : any) => {
  console.log("HOTEL DATA: ", data);
  const parsedData = schema.parse(data);
  return {
    ...parsedData,
    renting_status: "PENDING",
    created_at: new Date(),
    updated_at: new Date(),
  } as hotel_order;
};

export const receive_order = async (req: Request, res: Response): Promise<void> => {
  const manager_ordini = new HotelOrdersManager;
  const manager_db = new HotelDBManager;
  let request_body: hotel_order;  
  try {
    request_body = parseOrderWithDefaults(req.body, send_data_schema);
    } catch (error) {
      console.log("Error parsing data: request body not valid!", error);
      res.status(400).json({ error: "Bad Request" });
      return;
    }
    


    if (await manager_ordini.check_existance(request_body.order_id)) {
      console.log(request_body.order_id);
      res.status(409).json({ error: "Hotel order already exists" });
      return;
    }
    let [new_hotel_order, dateRecords] = await Promise.all([
      await manager_ordini.create_order(request_body),
      await manager_db.getDateIdsForRange(new Date(request_body.from), new Date(request_body.to))
    ])

    const dateIds = dateRecords.map((date : any) => date.id);

    if (dateIds.length === 0) {
      manager_ordini.update_status(new_hotel_order, "DENIED");
      console.log("No dates found for the requested range.");
      res.send("HOTELORDERDENIED");
      return;
    }
    const roomsAvailable = await manager_db.areRoomsAvailable(dateIds, new_hotel_order.room);

    if (!roomsAvailable) {
      manager_ordini.update_status(new_hotel_order, "DENIED");
      console.log("Room is not available for the entire date range.");
      res.send("HOTELORDERDENIED");
      return;
    }

    await manager_db.updateRoomAvailability(dateIds,  new_hotel_order.room);
    console.log(`Room ${ new_hotel_order.room} has been successfully booked.`);
    manager_ordini.update_status(new_hotel_order, "APPROVED");
    res.send(`HOTELAPPROVED`);
    return ;
  };

export const revert_order = async (req: Request, res: Response): Promise<void> => {
  const manager_ordini = new HotelOrdersManager;
  const manager_db = new HotelDBManager;
  let request_body: hotel_order;  
  try {
    request_body = parseOrderWithDefaults(req.body, revert_data_schema);
    } catch (error) {
      console.log("Error parsing data: request body not valid!", error);
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    if (!await manager_ordini.check_existance(request_body.order_id)) {
      res.status(409).json({ error: "Bike order does not exists" });
      return;
    }

    let info = await manager_db.get_order_info(request_body.order_id);
    if (!info){
      res.status(409).json({ error: "Bike order does not exist" });
      return;
    }
    let order = await manager_ordini.create_order(info);


    let dateRecords = await manager_db.getDateIdsForRange(new Date(request_body.from), new Date(request_body.to))
    const dateIds = dateRecords.map((date : any) => date.id);

    if (dateIds.length === 0) {
      manager_ordini.update_status(order, "DENIED")
      console.log("No dates found for the requested range.");
      return;
    }

    if (await manager_db.restoreRoomAvailability(dateIds, order.room))
    {
      manager_ordini.update_status(order, "REVERTED")
      res.send("HOTELORDERREVERTED")
    }
    else
    {
      manager_ordini.update_status(order, "DENIED")
      res.send("NOTHOTELORDERREVERTED")
    }


  
  }