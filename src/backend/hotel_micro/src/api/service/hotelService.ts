import { PrismaClient } from "@prisma/client";
import { string } from "zod";
/**DATA TABLE
                     * id | booking_date 
                    ---+--------------
                     1 | 2024-09-27
                     2 | 2024-09-28
                     3 | 2024-09-29
                     4 | 2024-09-30
                     5 | 2024-10-01
                     6 | 2024-10-02
                     7 | 2024-10-03
                     8 | 2024-10-04
                     9 | 2024-10-05
                    10 | 2024-10-06
                    11 | 2024-10-07 */
//prima prendo l id di ogni data della request
//avendo l id, posso filtrare attraverso il numero di stanza
//REQUEST (101, 1giugno, 5giugno)
// fatto questo, ottengo
//                          ROOM TABLE
//-----------------------------------------------------------
// id  | room_number | is_available    |       date_id      |
// ---+-------------+--------------+-------------------------
// 1   | 101         | f               |       1 (1 giugno) |
// 2   | 101         | t               |       2 (2 giugno) |
// 3   | 101         | t               |       3 (3 giugno) |
// 4   | 101         | t               |       4 (4 giugno) |
// 5   | 101         | f               |       5 (5 giugno) |
//-----------------------------------------------------------
// da qui posso controllare se tutte righe ottenute sono disponibili
//se si update il db e rispondo che la richiesta è stata accettata
//altrimenti rispondo che la richiesta non è stata accettata
const prisma = new PrismaClient();

interface hotelRequested {
  to: string;
  from: string;
  room: string;
}

export const check_hotel_availability = async (
  req: hotelRequested
): Promise<boolean> => {
  //TODO: implement the logic to check if the hotel is available through prisma and update it
  const startDate = new Date(req.from);
  const endDate = new Date(req.to);
  const room = req.room;
  const datesID = await prisma.date.findMany({
    where: {
      booking_date: {
        gte: startDate, //gte greater than or equal
        lte: endDate, //lte less than or equal
      },
    },
    select: {
      id: true,
    },
  });
  const searchRooms = datesID.map(async (date) => {
    const availablerooms = prisma.room.findMany({
      where: {
        date_id: {
          equals: date.id,
        },
        room_number: {
          equals: room,
        },
      },
      select: {
        is_available: true,
        room_number: true,
      },
    });
    return availablerooms;
  });
  let room_are_available = true;
  const rooms_available = await Promise.all(searchRooms);
  rooms_available.forEach((room) => {
    if (room[0].is_available === false) {
      room_are_available = false;
    }
  });
  if (room_are_available) {
    const updateRooms = datesID.map(async (date) => {
      const updateRoom = prisma.room.updateMany({
        where: {
          date_id: date.id,
          room_number: room,
        },
        data: {
          is_available: false,
        },
      });
      return updateRoom;
    });
    await Promise.all(updateRooms);
  }
  return room_are_available;
};
