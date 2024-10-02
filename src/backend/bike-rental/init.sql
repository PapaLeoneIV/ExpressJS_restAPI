CREATE TABLE "Bikes" (
    "id" TEXT NOT NULL,
    "road" INTEGER NOT NULL,
    "dirt" INTEGER NOT NULL,
    CONSTRAINT "Bikes_pkey" PRIMARY KEY ("id")
);

-- Insert sample data
INSERT INTO "Bikes" ("id", "road", "dirt") VALUES
('1', 5000, 6969);
