# WM Payment Portal

## Getting Started

1. Clone this repo

  ```sh
  $ git clone https://github.com/lscspirit/wmpayment.git
  ```

2. Start Mongo DB server

  ```sh
  $ docker run -d -p 27017:27017 mongo
  ```

3. Start Redis server

  ```sh
  $ docker run -p 6379:6379 -d redis
  ```

4. Start the app server (from within the repo directory)

  ```sh
  $ npm start
  ```

5. Visit the app at http://127.0.0.1:3000

## Configuration

### Server Port

You can change the application server port by using the `PORT` environment variable.

For example:
```sh
$ PORT=4000 npm start
```
Now, the app will be available at http://127.0.0.1:4000.

### Service Settings

Settings for database, redis and external services can be found at `/config/default.json`.

## Testing

### Test Suite

The test suite includes test cases for some of the logic. This is just a sample of how a test suite would look like. Due to time constraint, not all classes have tests. To run the test suite:

```sh
$ npm test
```