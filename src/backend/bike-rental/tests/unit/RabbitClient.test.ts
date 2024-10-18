import { RabbitClient } from '../../src/router/rabbitMQClient'; // Adjust the import path

jest.mock('amqplib', () => {
    const mChannel = {
        sendToQueue: jest.fn(),
        assertQueue: jest.fn(),
        consume: jest.fn(),
    };
    const mConnection = {
        createChannel: jest.fn().mockResolvedValue(mChannel),
    };
    return {
        connect: jest.fn().mockResolvedValue(mConnection),
    };
});

describe('RabbitClient', () => {
    let rabbitClient: RabbitClient;

    beforeEach(() => {
        rabbitClient = new RabbitClient();
        jest.clearAllMocks();
    });

    // --         TESTING AVERAGE CASES
    // -- connect
    test('connect: should connect to RabbitMQ server', async () => {
        await rabbitClient.connect();

        expect(rabbitClient.connection).toBeDefined();
        expect(rabbitClient.channel).toBeDefined();
        expect(rabbitClient.connected).toBe(true);
    });
    // -- sendToQueue
    test('sendToQueue: should send a message to the queue', async () => {
        const mockMessage = { message: 'Hello' }; // Mock message
        await rabbitClient.sendToQueue('test-queue', mockMessage);

        expect(rabbitClient.channel.sendToQueue).toHaveBeenCalledWith('test-queue', Buffer.from(JSON.stringify(mockMessage)));
    });
    // // -- consume
    // test('consume: should consume messages from the queue', async () => {
    //     const mockHandlerFunc = jest.fn();
    //     await rabbitClient.consume('test-queue', mockHandlerFunc);

    //     expect(rabbitClient.channel.assertQueue).toHaveBeenCalledWith('test-queue', {
    //         durable: true,
    //     });
    //     expect(rabbitClient.channel.consume).toHaveBeenCalledWith('test-queue', expect.any(Function), expect.any(Object));
    // }); 
});