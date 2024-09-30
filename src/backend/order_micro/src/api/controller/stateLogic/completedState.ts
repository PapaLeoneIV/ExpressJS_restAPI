import {OrderState, OrderContext} from "orderStateLogic"

export class CompletedState implements OrderState {
    async handle_request(context: OrderContext): Promise<void> {
        console.log('Order is completed!');
        /*TODO send response to UI */
    }
}