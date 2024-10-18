import { PrismaClient, order as Order } from "@prisma/client"; // Import PrismaClient
import { BikeOrderRepository, OrderDTO } from '../../src/service/OrderRepository/OrderRepository'; // Adjust the import path

jest.mock("@prisma/client", () => {
    const mOrderClient = {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
    };
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            order: mOrderClient,
        })),
    };
});

describe("BikeOrderRepository", () => {

    let bikeOrderRepo: BikeOrderRepository;
    let prisma: PrismaClient;

    beforeEach(() => {
        bikeOrderRepo = new BikeOrderRepository();
        prisma = new PrismaClient(); 
        jest.clearAllMocks(); 
    });

    // --         TESTING AVERAGE CASES
    // -- create_order
    test("create_order: should create a new bike order", async () => {
        const orderDTO: OrderDTO = {
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };

        const mockCreatedOrder = { ...orderDTO, id: "1" }; // Mock response
        (prisma.order.create as jest.Mock).mockResolvedValue(mockCreatedOrder); // Mock the create method

        const result = await bikeOrderRepo.create_order(orderDTO);

        expect(result).toEqual(mockCreatedOrder);
        expect(prisma.order.create).toHaveBeenCalledWith({
            data: {
                road_bike_requested: orderDTO.road_bike_requested,
                dirt_bike_requested: orderDTO.dirt_bike_requested,
                order_id: orderDTO.order_id,
                renting_status: orderDTO.renting_status,
                created_at: orderDTO.created_at,
                updated_at: orderDTO.updated_at,
            },
        });
    });
    // -- update_order
    test("update_order: should update a bike order", async () => {
        const order: Order = {
            id: "1",
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
        const updatedOrder: Order = {
            ...order,
            road_bike_requested: 2,
            updated_at: new Date(),
        };
        (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);

        const result = await bikeOrderRepo.update_order(order);

        expect(result).toEqual(updatedOrder);
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: {
                id: order.id,
            },
            data: {
                road_bike_requested: order.road_bike_requested,
                dirt_bike_requested: order.dirt_bike_requested,
                order_id: order.order_id,
                renting_status: order.renting_status,
                created_at: order.created_at,
                updated_at: order.updated_at,
            },
        });
    });
    // -- update_status
    test ("update_status: should update the status of a bike order", async () => {
        const order: Order = {
            id: "1",
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
        const updatedOrder: Order = {
            ...order,
            renting_status: "completed",
        };
        (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);

        const result = await bikeOrderRepo.update_status(order, "completed");

        expect(result).toEqual(updatedOrder);
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: {
                id: order.id,
            },
            data: {
                renting_status: "completed",
            },
        });
    });
    // -- check_existance
    test("check_existance: should return true if order exists", async () => {
        const order: Order = {
            id: "1",
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
        (prisma.order.findFirst as jest.Mock).mockResolvedValue(order);

        const result = await bikeOrderRepo.check_existance("123");

        expect(result).toBe(true);
        expect(prisma.order.findFirst).toHaveBeenCalledWith({
            where: {
                order_id: "123",
            },
        });
    });
    // -- check_existance
    test("check_existance: should return false if order does not exist", async () => {
        (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await bikeOrderRepo.check_existance("123");

        expect(result).toBe(false);
        expect(prisma.order.findFirst).toHaveBeenCalledWith({
            where: {
                order_id: "123",
            },
        });
    });
    // -- get_order_info
    test ("get_order_info: sould return information about a bike order", async () => {
        const order: Order = {
            id: "1",
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
        (prisma.order.findFirst as jest.Mock).mockResolvedValue(order);

        const result = await bikeOrderRepo.get_order_info("123");

        expect(result).toEqual(order);
        expect(prisma.order.findFirst).toHaveBeenCalledWith({
            where: {
                order_id: "123",
            },
        });
    });
    // -- delete_order
    test("delete_order: should delete a bike order ad return the DTO (good practice)", async () => {
        const id: String = "1";
        const order: Order = {
            id: "1",
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
        (prisma.order.delete as jest.Mock).mockResolvedValue(order);
        
        const result = await bikeOrderRepo.delete_order(order);
        
        expect(result).toEqual(order);
        expect(prisma.order.delete).toHaveBeenCalledWith({
            where: {
                id: order.id,
            },
        });
    });

    // --         TESTING EDGE CASES
    // -- create_order
    test("create_order: should throw error when creating a bike order with missing data", async () => {
        const incompleteOrder: Partial<OrderDTO> = {
            road_bike_requested: 1, // missing other required fields like `order_id`
        };
        
        await expect(bikeOrderRepo.create_order(incompleteOrder as OrderDTO))
        .rejects
        .toThrow("Missing required fields");
    });

    test("create_order: should throw error when creating a bike order with invalid data type", async () => {
        const invalidOrder: any = {
            order_id: "123",
            road_bike_requested: "invalid", // this should be a number
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
    
        await expect(bikeOrderRepo.create_order(invalidOrder))
            .rejects
            .toThrow("Invalid data type");
    });
    // -- update_order
    test("update_order: should throw error when trying to update a non-existent order", async () => {
    const nonExistentOrder: Order = {
        id: "999",
        order_id: "non-existent",
        road_bike_requested: 1,
        dirt_bike_requested: 0,
        renting_status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
    };
    (prisma.order.update as jest.Mock).mockRejectedValue(new Error("RecordNotFound"));

    await expect(bikeOrderRepo.update_order(nonExistentOrder))
        .rejects
        .toThrow("RecordNotFound");
    });
    // -- get_order_info
    test("get_order_info: should return null if order does not exist", async () => {
        (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);
    
        const result = await bikeOrderRepo.get_order_info("123");
    
        expect(result).toBe(null);
        expect(prisma.order.findFirst).toHaveBeenCalledWith({
            where: {
                order_id: "123",
            },
        });
    });
    // -- delete_order
    test("delete_order: should throw error when deleting non-existent order", async () => {
        const nonExistentOrder: Order = {
            id: "999", // non-existent ID
            order_id: "non-existent",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
    
        (prisma.order.delete as jest.Mock).mockRejectedValue(new Error("RecordNotFound"));
    
        await expect(bikeOrderRepo.delete_order(nonExistentOrder))
            .rejects
            .toThrow("RecordNotFound");
    });
    
    // --         TESTING DATABSE CONNECTIONS
    // -- create_order
    test("create_order: should handle database connection errors", async () => {
        (prisma.order.create as jest.Mock).mockRejectedValue(new Error("Database connection error"));
    
        const bikeOrder: OrderDTO = {
            order_id: "123",
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
    
        await expect(bikeOrderRepo.create_order(bikeOrder))
            .rejects
            .toThrow("Database connection error");
    });

    test("create_order: should throw error if order_id is empty", async () => {
        const invalidOrder: OrderDTO = {
            order_id: "", // empty order_id
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
    
        await expect(bikeOrderRepo.create_order(invalidOrder))
            .rejects
            .toThrow("Invalid order_id");
    });
    
    test("create_order: should throw error when creating a bike order with a duplicate order_id", async () => {
        const duplicateOrder: OrderDTO = {
            order_id: "123", // assuming this order_id already exists
            road_bike_requested: 1,
            dirt_bike_requested: 0,
            renting_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
    
        // Mock the Prisma `create` method to throw a unique constraint error
        (prisma.order.create as jest.Mock).mockRejectedValue(new Error("Unique constraint failed on the fields: (`order_id`)"));
    
        await expect(bikeOrderRepo.create_order(duplicateOrder))
            .rejects
            .toThrow("Unique constraint failed on the fields: (`order_id`)");
    });    
    
});
