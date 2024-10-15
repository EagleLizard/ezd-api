
include .env

hard-reset-db:
	docker-compose down --rmi all
	rm -rf ./ezd_api_db_data
	docker-compose up -d db --remove-orphans
# simple file dev server
sfs-dev:
	python3 -m http.server -d ./_local/static ${SFS_PORT}
