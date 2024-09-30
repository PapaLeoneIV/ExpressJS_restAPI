import { WaitingState } from './waitingState'
import axios from "axios"

export interface OrderState {
    handle_request(context: OrderContext, bikes:{road: string, dirt:string}, hotel: {from: Date, to: Date, room: number }): Promise<void>;
}

export class OrderContext {
    private state: OrderState;
    private bikes: {road: string, dirt: string};
    private hotel: {from: Date, to: Date, room: number }
    //private card: string;
    
    constructor(bikes: { road: string, dirt: string}, 
                        hotel: {from: Date, to: Date, room: number }) 
    {
        this.bikes = bikes;
        this.hotel = hotel;
        this.state = new WaitingState()
    }

    getState(){
        return this.state;
    }

    setState(state: OrderState) {
        this.state = state;
    }

    async processOrder(bikes: { road: string, dirt: string}, hotel: {from: Date, to: Date, room: number }) {
        await this.state.handle_request(this, bikes, hotel)
    }

    async sendRequestToBikeShop(bikes: {road: string, dirt: string}): Promise<string> {
        /*TODO implement POST request to bike */
        console.log("sending request to bikeShop!")
        try {
            const response : any = await axios.post("http://localhost:3000/bike_renting/send_data", { bikes });
            return response.data; 
        } catch (error) {
            console.error("Error sending request:", error);
            throw error;
        } 
    }

    async sendRequestToHotel(hotel: {from: Date, to: Date, room: number }): Promise<string> {
        console.log("sending request to hotel service!")
        try {
            const response : any = await axios.post("http://localhost:3001/hotel_booking/send_data", { hotel });
            return response.data; 
        } catch (error) {
            console.error("Error sending request:", error);
            throw error; 
        }
    }


    /*TODO implement the different requests to Money*/
    /*TODO implement the response to UI */

}




