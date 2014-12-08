TESTS = grunt connect:test qunit
.PHONY: build

test:
	grunt build
	$(TESTS)

server:
	grunt connect:local

build:
	$(TESTS)
	grunt build