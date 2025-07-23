# Homelink-code-test

Written by Ben Mumford

## Running

* Install dependencies using `npm i` or `npm ci`
* Run mongo using `docker compose up`
* Run application using `npm run start:dev` or from built JS using `npm run build` then `npm run start:prod`

## Testing

* Run `npm run test:ci` or `npm run test:dev`

## Documentation

Swagger documentation vailable at http://localhost:3000/documentation

## Decisions

* Decided to use nodejs and typescript as it is the primary stack at Homelink :)
* Weighed up using several different HTTP frameworks before settling on Fastify for the following reasons:
  * Good typescript support
  * Lightweight - discounted NestJs for this reason
  * Good logging
  * Easy to test
  * Easy to support swagger documentation
* Decided to use MongoDB
  * Easy to integrate into Fastify
  * Meets the requirements well, no need for joins or other aggregation
  * In memory server available for testing

## If I had more time

* More unit testing for controller
* Front end
* Add HATEOAS for improved discoverability
* Pagination of results
* Deployment options - Docker image or make available as a Lambda function