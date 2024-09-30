import express from 'express';
import { db, connectToDatabase } from './db/db';
import { app, HotelRouter } from "./api/router/hotelRouter"

const port = 3001;

function main() {
    connectToDatabase();
    app.use("/hotel_booking/", HotelRouter);

    app.listen(port, () => {
        console.log("[INFO] Server running on http://localhost:3001");
    });
}

main();

