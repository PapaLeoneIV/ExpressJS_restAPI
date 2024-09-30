import express from 'express';
import { db, connectToDatabase } from './db/db';
import { app, OrderRouter } from "./api/router/orderRouter"

const port = 3003;

function main() { 
    
    connectToDatabase();
    app.use("/order/", OrderRouter);

    app.listen(port, () => {
       console.log("[INFO] Server running on http://localhost:3003");
    });
}

main();


