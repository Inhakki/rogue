.PHONY: build

test:
	grunt connect:test qunit

build:
	grunt build-clean copy
	core build-deps

server:
	grunt copy connect:local
