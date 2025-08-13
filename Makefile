
include .env
include ./scripts/config.sh

build-image:
	./scripts/build-image.sh
run-image:
	docker run --rm -it -p ${EZD_PORT}:${EZD_PORT}	\
		-e EZD_ENV=${EZD_ENV} \
		-e EZD_HOST=0.0.0.0 \
		-e EZD_PORT=${EZD_PORT} \
		-e POSTGRES_HOST=${POSTGRES_HOST} \
		-e POSTGRES_PORT=${POSTGRES_DOCKER_PORT} \
		-e POSTGRES_USER=${POSTGRES_USER} \
		-e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
		-e POSTGRES_DB=${POSTGRES_DB} \
		-e EZD_WEB_ORIGIN=${EZD_WEB_ORIGIN} \
		-e SFS_HOST=${SFS_HOST} \
		-e SFS_PORT=${SFS_PORT} \
		-e EZD_AWS_ACCESS_KEY_ID=${EZD_AWS_ACCESS_KEY_ID} \
		-e EZD_AWS_SECRET_ACCESS_KEY=${EZD_AWS_SECRET_ACCESS_KEY} \
		--name ezd_api eaglelizard/ezd-api:latest
hard-reset-db:
	docker compose down --rmi all
	rm -rf ./ezd_api_db_data
	docker compose up -d db --remove-orphans
	docker compose logs --follow
# simple file dev server
sfs-dev:
	python3 -m http.server -d ./_local/static ${SFS_PORT}
build-jcd-web-image:
	docker build -t ${JCD_WEB_CONTAINER_TAG} ./jcd-web/ -f ./jcd-web/Dockerfile.jcd-web
build-jcd-web: build-jcd-web-image
	docker run \
	-v ./jcd-web/dist:/home/jcd-web-dist \
	--name ${JCD_WEB_CONTAINER_NAME} --rm ${JCD_WEB_CONTAINER_TAG} ./build-jcd-web.sh
