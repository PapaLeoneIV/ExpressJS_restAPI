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