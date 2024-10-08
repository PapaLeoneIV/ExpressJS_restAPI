CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "order" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "room" TEXT NOT NULL,

    "road_bike_requested" TEXT NOT NULL,
    "dirt_bike_requested" TEXT NOT NULL,

    "amount" TEXT NOT NULL,

    "order_status" TEXT NOT NULL,

    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
); 