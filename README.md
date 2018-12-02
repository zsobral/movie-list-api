# movie-list-api 

[![CircleCI](https://circleci.com/gh/zsobral/movie-list-api.svg?style=shield)](https://circleci.com/gh/zsobral/movie-list-api)
[![GitHub license](https://img.shields.io/github/license/zsobral/movie-list-api.svg)](https://github.com/zsobral/movie-list-api/blob/master/LICENSE)



## Requirements

* Docker
* Docker Compose
* [TMDb](https://www.themoviedb.org/) API key

## Docs

https://movie-list-api.surge.sh/

## Run

```bash
# start server
docker-compose up

# stop server
docker-compose stop

# run tests
docker-compose exec api npm test
```
