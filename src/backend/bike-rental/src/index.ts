import express from 'express';
import { db, connectToDatabase } from './db/db';
import { app, BikeRouter } from "./api/router/bikeRouter"
const port = 3000;

let order = {
    "order": {
        "card": "1234-4321-5678-8765",
        "bikes": {
            "road": "2",
            "dirt": "3"
        },
        "hotel": {
            "from": "12/12/12",
            "to": "01/2/16",
            "room": "104"
        }
    }
}

function main() {
    connectToDatabase();
    app.use("/bike_rental/", BikeRouter);

    app.listen(port, () => {
        console.log("[INFO] Server running on http://localhost:3000");
    });
}

main();