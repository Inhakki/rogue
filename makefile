TESTS = grunt connect:test qunit

test:
	$(TESTS)

server:
	core build-deps
	grunt connect:local
