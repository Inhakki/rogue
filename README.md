# AKQA Web Framework

## Contents

1. [Summary](#summary)
1. [Developer Setup](#developer-setup)
1. [Usage](#usage)
1. [Release History](#release-history)

<a name="summary"></a>
## Summary
AKQA Web Framework is a internal framework built to simplify development of front-end AKQA apps.

<a name="developer-setup"></a>
## Developer Setup

### Dependencies

#### NodeJS

You can install Node.js via the package provided on [their site](http://www.nodejs.org).

#### AKQA Core

You must install AKQA Core package globally by typing the following in your terminal while connected to the AKQA internal network:

```
npm install git+ssh://git@github.com/AKQADC/AKQA-Core.git  -g
```

### Installation

Then, add this package to your project to your `package.json` file:

```javascript
{
    "devDependencies": {
        "akqa-web-framework": "git+ssh://git@github.com/AKQADC/AKQA-Web-Framework.git#[VERSION]" // the [VERSION] of the package to use
    }
}
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

### Tasks

Once installed, you can use the following commands:

#### make test

To run all tests on the project, type:

```
make test
```

## Release History
* 2014-20-07   v0.1.0   Added testing framework and necessary project dependencies
