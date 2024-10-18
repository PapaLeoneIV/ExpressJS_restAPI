import { BikeDBRepository } from '../../src/service/StorageRepository/StorageRepository';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mBikeClient = {
        aggregate: jest.fn(),
        updateMany: jest.fn(),
    };
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            bikes: mBikeClient,
        })),
    };
});

describe('BikeDBRepository', () => {
    let storageRepo: BikeDBRepository;
    let prisma: PrismaClient;

    beforeEach(() => {
        storageRepo = new BikeDBRepository();
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    // --         TESTING AVERAGE CASES
    // -- get_number_road_bikes
    test('get_number_road_bikes: should return the number of road bikes', async () => {
        const mockRoadBikesCount = { _sum: { road: 10 } }; // Mock response
        (prisma.bikes.aggregate as jest.Mock).mockResolvedValue(mockRoadBikesCount); // Mock the aggregate method

        const result = await storageRepo.get_number_road_bikes();

        expect(result).toEqual(mockRoadBikesCount._sum.road);
        expect(prisma.bikes.aggregate).toHaveBeenCalledWith({
            _sum: {
                road: true,
            },
        });
    });
    // -- get_number_dirt_bikes
    test('get_number_dirt_bikes: should return the number of dirt bikes', async () => {
        const mockDirtBikesCount = { _sum: { dirt: 5 } }; // Mock response
        (prisma.bikes.aggregate as jest.Mock).mockResolvedValue(mockDirtBikesCount); // Mock the aggregate method

        const result = await storageRepo.get_number_dirt_bikes();

        expect(result).toEqual(mockDirtBikesCount._sum.dirt);
        expect(prisma.bikes.aggregate).toHaveBeenCalledWith({
            _sum: {
                dirt: true,
            },
        });
    });
    // -- increment_bike_count
    test('increment_bike_count: should increment the bike count', async () => {
        await storageRepo.increment_bike_count(1, 2);

        expect(prisma.bikes.updateMany).toHaveBeenCalledWith({
            data: {
                road: {
                    increment: 1,
                },
                dirt: {
                    increment: 2,
                },
            },
        });
    });
    // -- decrement_bike_count
    test('decrement_bike_count: should decrement the bike count', async () => {
        await storageRepo.decrement_bike_count(1, 2);

        expect(prisma.bikes.updateMany).toHaveBeenCalledWith({
            data: {
                road: {
                    decrement: 1,
                },
                dirt: {
                    decrement: 2,
                },
            },
        });
    });
});