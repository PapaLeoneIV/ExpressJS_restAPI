.PHONY: start_bike_micro start_hotel_micro start_money_micro start_order_micro start_docker_compose start_all

# Define paths to each microservice
NAME=expressjs_restapi
BIKE_MICRO_DIR=./src/backend/bike_micro
HOTEL_MICRO_DIR=./src/backend/hotel_micro
MONEY_MICRO_DIR=./src/backend/money_micro
ORDER_MICRO_DIR=./src/backend/order_micro

#---FULL APPLICATION MANAGEMENT---#
all: build up

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

#---BIKE MICROSERVICE MANAGEMENT---#
build-bike-service:
	docker compose build bike-service

up-bike-service:
	docker compose up -d db_bike
	docker compose up bike-service 
#

#---HOTEL MICROSERVICE MANAGEMENT---#
build-hotel-service:
	docker compose build hotel-service

up-hotel-service:
	docker compose up -d db_hotel
	docker compose up hotel-service

#---MONEY MICROSERVICE MANAGEMENT---#
build-money-service:
	docker compose build money-service

up-money-service:
	docker compose up -d db_money
	docker compose up money-service

#---ORDER MICROSERVICE MANAGEMENT---#
build-order-service:
	docker compose build order-management-service

up-order-service:
	docker compose up -d db_order_management
	docker compose up order-management-service

#---DOCKER COMPOSE MANAGEMENT---#

# Start all microservices
start_docker_compose:
	docker compose up

# Start bike microservice
start_bike_micro:
	docker compose up bike-service

# Start hotel microservice
start_hotel_micro:
	docker compose up hotel-service