# AKQA Web Framework

## Contents

1. [Summary](#summary)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Development](#development)
1. [Release History](#release-history)

<a name="summary"></a>
## Summary
AKQA Web Framework is a internal framework built to simplify development of all web-based front-end AKQA apps.

<a name="installation"></a>

## Installation

### Dependencies

#### NodeJS

You can install Node.js via the package provided on [their site](http://www.nodejs.org).

#### AKQA Core

You must install AKQA Core package globally by typing the following in your terminal while connected to the AKQA internal network:

```
npm install git+ssh://git@github.com/AKQADC/AKQA-Core.git  -g
```

Then, add this package to your project to your `package.json` file:

```javascript
{
    "devDependencies": {
        "akqa-web-framework": "git+ssh://git@github.com/AKQADC/AKQA-Web-Framework.git#[VERSION]" // the [VERSION] of the package to use
    }
}
```

Then run:

```
npm install
```

Then, add your build destination to the `core.packages` config in your `package.json` file:

```javascript
{
    "core": {
        "packageDest": "path/to/deploy/folder", // where you want the library files injected to be available to your build
        "packages": {
            "akqa-web-framework": {
                "dirName": "new-name" // optional: if you want to rename the folder of the core module
            }
        }
    }
}
```

Then run:

```
core build-deps
```

<a name="usage"></a>
## Usage

To use the javascript library of classes that Web Framework provides, you will need to first make sure you're using [RequireJS](http://requirejs.org/).

Then,specify where your web-framework modules are located in your `paths` configuration of your require config:

```
require.config({
    paths: {
            framework: '/path/to/web-framework/module'
        }
    }
);
```

Then you're free to use any javascript module provided by web framework.

__Please note that your module ID for require must be 'framework' as we have reserved this module ID for all framework modules.__

<a name="development"></a>
## Development

The following are tasks that are available when developing on Web Framework.

#### make build

To build the project for deployment:

```
make build
```

#### make test

To run all tests on the project, type:

```
make test
```

## Release History
* 2014-20-07   v0.1.0   Added testing framework and necessary project dependencies
