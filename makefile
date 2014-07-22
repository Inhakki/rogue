.PHONY: build

test:
	grunt connect qunit

build:
	grunt build-clean copy
	core build-deps
