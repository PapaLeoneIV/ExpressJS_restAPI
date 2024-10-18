import { handle_req_from_order_management } from '../../src/controller/handlers';
import { RabbitClient } from '../../src/router/rabbitMQClient';
import { BikeOrderRepository, OrderDTO } from '../../src/service/OrderRepository/OrderRepository';
import { BikeDBRepository } from '../../src/service/StorageRepository/StorageRepository';

jest.mock('../../src/router/rabbitMQClient');
jest.mock('../../src/service/OrderRepository/OrderRepository');
jest.mock('../../src/service/StorageRepository/StorageRepository');

describe('Bike Service Integration Tests', () => {
  let rabbitClient: jest.Mocked<RabbitClient>;

  beforeEach(() => {
    rabbitClient = new RabbitClient() as jest.Mocked<RabbitClient>;
    rabbitClient.sendToOrderManagementMessageBroker = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should approve the order if enough bikes are available', async () => {
    const mockOrderData = {
      order_id: '12345',
      road_bike_requested: 2,
      dirt_bike_requested: 1,
      renting_status: 'PENDING',
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Mock BikeOrderRepository behavior
    const mockBikeOrderRepo = BikeOrderRepository.prototype;
    mockBikeOrderRepo.check_existance = jest.fn().mockResolvedValue(false);
    mockBikeOrderRepo.create_order = jest.fn().mockResolvedValue(mockOrderData);
    mockBikeOrderRepo.update_status = jest.fn().mockResolvedValue({ ...mockOrderData, renting_status: 'APPROVED' });

    // Mock BikeDBRepository behavior
    const mockBikeDBRepo = BikeDBRepository.prototype;
    mockBikeDBRepo.get_number_dirt_bikes = jest.fn().mockResolvedValue(5);
    mockBikeDBRepo.get_number_road_bikes = jest.fn().mockResolvedValue(5);
    mockBikeDBRepo.decrement_bike_count = jest.fn();

    const msg = JSON.stringify({
      description: JSON.stringify({
        order_id: '12345',
        road_bike_requested: 2,
        dirt_bike_requested: 1,
        renting_status: 'PENDING',
        created_at: new Date(),
        updated_at: new Date(),
      })
    });

    await handle_req_from_order_management(rabbitClient, msg);

    expect(mockBikeOrderRepo.check_existance).toHaveBeenCalledWith('12345');
    expect(mockBikeOrderRepo.create_order).toHaveBeenCalled();
    expect(mockBikeDBRepo.decrement_bike_count).toHaveBeenCalledWith(2, 1);
    expect(rabbitClient.sendToOrderManagementMessageBroker).toHaveBeenCalledWith(
      JSON.stringify({ id: '12345', status: 'APPROVED' })
    );
  });
});

