.PHONY: all build up down build-bike-rental-service up-bike-rental-service build-hotel-booking-service up-hotel-booking-service build-payment-service up-payment-service build-order-service up-order-service start_docker_compose start_bike-rental start_hotel-booking

#---FULL APPLICATION MANAGEMENT---#
all: build up

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

#---BIKE MICROSERVICE MANAGEMENT---#
build-bike-rental-service:
	docker compose build bike-rental-service

up-bike-rental-service:
	docker compose up -d db_bike_rental
	docker compose up bike-rental-service 
#

#---HOTEL MICROSERVICE MANAGEMENT---#
build-hotel-booking-service:
	docker compose build hotel-booking-service

up-hotel-booking-service:
	docker compose up -d db_hotel_booking --remove-orphans
	docker compose up hotel-booking-service --remove-orphans

#---MONEY MICROSERVICE MANAGEMENT---#
build-payment-service:
	docker compose build payment-service

up-payment-service:
	docker compose up -d db_payment --remove-orphans
	docker compose up payment-service --remove-orphans

#---ORDER MICROSERVICE MANAGEMENT---#
build-order-service:
	docker compose build order-management-service

up-order-service:
	docker compose up -d db_order_management --remove-orphans
	docker compose up order-management-service --remove-orphans

#---DOCKER COMPOSE MANAGEMENT---#

# Start all microservices
start_docker_compose:
	docker compose up

# Start bike microservice
start_bike-rental:
	docker compose up bike-rental-service

# Start hotel microservice
start_hotel-booking:
	docker compose up hotel-booking-service