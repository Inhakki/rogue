# Contributing to Rogue

Anyone can contribute to the code base by using the following setup.

## Development Setup

### Apache

In your hosts file, add the following entry:

```
0.0.0.0       rogue.dc.akqa.com
```

## Tasks

The following terminal commands are available when developing on Rogue.

### make build

Builds the project into the build folder.

```shell
make build
```

### make server

Starts a web server to make the entire project "browseable".  To run the server:

```shell
make server
```

### make test

Runs all tests on the project (currently all tests are written in QUnit).  This does the following:
* starts a headless web server
* runs all tests in the [QUnit](http://qunitjs.com) tests/index.html file

```shell
make test
```

_Tests can also be run via browser by running `make server` and just browsing to the tests/index.html file._


