TESTS = grunt connect:test qunit

test:
	$(TESTS)

server:
	grunt connect:local
