.PHONY: build

test:
	grunt connect:test qunit

build:
	grunt build-clean copy
	core build-deps

server:
	grunt build-clean copy
	core build-deps
	grunt connect:local

test-server:
	grunt copy
	grunt connect:test-server
