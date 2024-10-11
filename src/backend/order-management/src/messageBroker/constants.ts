import dotenv from "dotenv"

const YOUR_USERNAME=process.env.RABBITMQ_USER
const YOUR_PASSWORD=process.env.RABBITMQ_PASSWORD

export const CONNECTION_STRING = process.env.RABBITMQ_URL

// Define queue properties and configurations
export const QUEUE_OPTIONS = {
    durable: true, // Make the queue durable
    exclusive: false, // Not exclusive
    autoDelete: false, // Don't auto-delete the queue
    arguments: {
        'x-message-ttl': 30000, // Message TTL of 30 seconds
        'x-max-length': 1000, // Maximum queue length of 1000 messages
    },
};

export const ACKNOWLEGMENT = {noAck: false};