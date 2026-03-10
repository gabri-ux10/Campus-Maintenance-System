BUILD_DIR ?= build
CMAKE ?= cmake

.PHONY: configure build test clean

configure:
	$(CMAKE) -S . -B $(BUILD_DIR)

build: configure
	$(CMAKE) --build $(BUILD_DIR) --config Release

test: build
	ctest --test-dir $(BUILD_DIR) --output-on-failure

clean:
	$(CMAKE) -E rm -rf $(BUILD_DIR)
