import {OrderState, OrderContext} from "orderStateLogic"


/*TODO I need to understand if it will be better to split the failedState in various organs 
 * so that each failed state will have its routine to rollback the changes
 */
export class FailedState implements OrderState {
    async handle_request(context: OrderContext): Promise<void> {
        console.log('Order was not succesfull!');
        /*TODO roll back database */
        /*TODO send response to UI */
    }
}