# C++ Optimization Module

Optional JNI-backed native module for:

- maintenance assignment scoring
- safe image optimization for JPEG, PNG, and WEBP uploads

The backend does not require this module to start. Native behavior is enabled only when `APP_NATIVE_ENABLED=true` and the compiled shared library is available.

## Linux build prerequisites

- `cmake`
- `g++`
- `default-jdk` or another JDK with JNI headers
- `libjpeg-dev`
- `libpng-dev`
- `libwebp-dev`
- `pkg-config`

Example on Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y cmake g++ default-jdk libjpeg-dev libpng-dev libwebp-dev pkg-config
make test
```

## Windows notes

- Use a JDK that exposes JNI headers.
- Build with a compiler/toolchain supported by CMake, such as Visual Studio Build Tools or MinGW.
- Install `libjpeg`, `libpng`, and `libwebp` development packages through your package manager of choice.
- The backend should keep `APP_NATIVE_ENABLED=false` until the compiled library is on the JVM library path.

## Outputs

- `campusfix_native`: JNI shared library loaded by the backend when enabled
- `campusfix_native_bench`: small benchmark/smoke executable for assignment scoring
- `campusfix_native_tests`: native regression test binary
