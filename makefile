.PHONY: build

TESTS = grunt connect:test qunit

test:
	$(TESTS)

build:
	$(TESTS)
	grunt build-clean copy
	core build-deps

server:
	grunt build-clean copy
	core build-deps
	grunt connect:local

test-server:
	grunt copy
	grunt connect:test-server
