# Contributing to Rogue

Anyone can contribute to the code base by using the following setup.

## Development Setup

### NPM modules

You'll need all of the node dependencies, to install them with the following terminal command:

```shell
npm install
```

## Tasks

The following terminal commands are available when developing on Rogue.

### grunt build

Builds the project into the build folder.

```shell
grunt build
```

### grunt server

Starts a web server to make the entire project "browseable".  To run the server:

```shell
grunt server
```

### grunt test

Runs all tests on the project (currently all tests are written in QUnit).  This does the following:
* starts a headless web server
* runs all tests in the [QUnit](http://qunitjs.com) tests/index.html file

```shell
grunt test
```

_Tests can also be run via browser by running `grunt server` and just browsing to the tests/index.html file._

