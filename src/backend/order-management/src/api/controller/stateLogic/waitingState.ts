import { OrderState, OrderContext } from "./orderStateLogic";
import { CompletedState } from "./completedState";
import { FailedState } from "./failedState";

/*TODO implementare la chiamata verso al servizio dei soldi solo quando bike and hotel hanno
entrambi confermato la disponibilità */

export class WaitingState implements OrderState {
  async handle_request(
    context: OrderContext,
    bikes: { road: string; dirt: string },
    hotel: { from: Date; to: Date; room: number }
  ): Promise<void> {
    console.log("Order is in pending state, processing...");
    try {
      const [bike_response, hotel_response] = await Promise.all([
        await context.sendRequestToBikeShop(bikes),
        await context.sendRequestToHotel(hotel),
      ]);
      try {
        
      } catch (error) {
        
      }
      if (
        bike_response === "BIKEAPPROVED" &&
        hotel_response === "HOTELAPPROVED"
      ) {
        console.log("approved");
        context.setState(new CompletedState());
        context.processOrder(bikes, hotel);
      } else {
        console.log("denied");
        /*TODO prob will need to differentiate between various FailedStates */
        context.setState(new FailedState());
        context.processOrder(bikes, hotel);
      }
    } catch (error) {
      console.error("Error in sending order!");
      context.setState(new FailedState());
    }
  }
}
