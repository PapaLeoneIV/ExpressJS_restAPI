import client, { Connection, Channel } from "amqplib";
import { rmqUser, rmqPass, rmqhost, REQ_BIKE_QUEUE, RESP_BIKE_QUEUE} from "./config"
import { sendNotification } from "./notification";
import { handle_req_from_order_management} from "./handlers";

type HandlerCB = (msg: string, instance?: RabbitMQConnection) => any;

export class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`[BIKE SERVICE] Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(
        `amqp://${rmqUser}:${rmqPass}@${rmqhost}:5672`
      );

      console.log(`[BIKE SERVICE] Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log(`[BIKE SERVICE] Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(error);
      console.error(`[BIKE SERVICE]Not connected to MQ Server`);
    }
  }

  async sendToQueue(queue: string, message: any): Promise<boolean> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error("[BIKE SERVICE]", error);
      throw error;
    }

  }

  async consume(queue: string, handlerFunc: HandlerCB) {
    await this.channel.assertQueue(queue, {
      durable: true,
    });

    this.channel.consume(
      queue,
      (msg : any) => {
        {
          if (!msg) {
            return console.error(`[BIKE SERVICE]Invalid incoming message`);
          }
          handlerFunc(msg?.content?.toString());
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }

  consumeBikeOrder = async () => {
    console.log("[BIKE SERVICE] Listening for bike orders...");
    this.consume(RESP_BIKE_QUEUE, (msg) => handle_req_from_order_management(this, msg));
  };

  sendToOrderManagementMessageBroker = async (body: string): Promise<void> => {
    const newNotification = {
      title: "Bike response incoming",
      description: body,
    };
    sendNotification(newNotification, REQ_BIKE_QUEUE);
  };

}

export const rabbitmqClient = new RabbitMQConnection();

