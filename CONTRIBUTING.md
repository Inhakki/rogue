# Contributing to Rogue

Anyone can contribute to the code base by using the following setup.

## Install required dependencies

In order to develop for the Rogue platform, you must install the following dependencies onto your machine.

* [node.js](http://nodejs.org/)
* [Grunt](http://gruntjs.com/getting-started)
* [Bower](http:/http://bower.io/)

## Download modules locally

Download all required modules for the project with the following commands

```shell
npm install
```

```shell
bower install
```

## Tasks

The following terminal commands are available when developing on Rogue.

### Cuttin' a build

Builds the project into the build folder.

```shell
grunt build
```

### Running the server locally

Starts a web server to make the entire project "browseable" for rapid development.  To run the server:

```shell
grunt server
```

### Unit tests

Runs all tests on the project (currently all tests are written in QUnit).  This does the following:
* starts a headless web server
* runs all tests in the [QUnit](http://qunitjs.com) tests/index.html file

```shell
grunt test
```

_Tests can also be run via browser by running `grunt server` and just browsing to the tests/index.html file._


### Creating a release

To run releases, you must have the [Git Hubflow tools](http://datasift.github.io/gitflow/GitFlowForGitHub.html) installed
in your directory to give you access to the release commands.

1. Run `git hf release start [VERSION]` -- with [VERSION] being the full, [semantic version number](http://semver.org).
Which will start and checkout a new release branch.
1. While on the release branch, package a release by running `grunt release:[TYPE]` -- with [TYPE] being the version type of `patch`, `minor`, or `major`. Which one you
choose should be determined using the [semantic versioning principles](http://semver.org). This command will bump up
 the version number in the project and build the appropriate files into the "build" folder.
1. Commit the modified files using a message of "release [VERSION]", changing [VERSION] to the new release version number.
1. Finalize the release by running Hubflow's `git hf release finish [VERSION]` command, which will auto merge the release into "master" branch
 and back-merge it all into "develop" branch.


### Publishing the API documentation

When a release is packaged and ready to be used by the public, it's a good idea to update the API documentation. You
can do this with the following command:

```shell
grunt publish_api
```