TESTS = grunt connect:test qunit

test:
	grunt build
	$(TESTS)

server:
	grunt connect:local

build:
	grunt build