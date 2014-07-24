.PHONY: build

TESTS = grunt connect:test qunit

test:
	$(TESTS)

build:
	$(TESTS)
	grunt build-clean copy:main
	core build-deps

server:
	grunt build-clean copy:main
	core build-deps
	grunt connect:local

test-server:
	grunt build-clean copy:main
	core build-deps
	grunt connect:test-server
