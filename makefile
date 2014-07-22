.PHONY: build

test:
	grunt connect qunit

build:
	grunt copy
