cmake_minimum_required(VERSION 3.20)
project(campusfix_native LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(JNI REQUIRED)
find_package(JPEG REQUIRED)
find_package(PNG REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(WEBP REQUIRED IMPORTED_TARGET libwebp)

add_library(campusfix_native SHARED
    src/assignment_algorithm.cpp
    src/image_compressor.cpp
    src/jni_bindings.cpp
)
target_include_directories(campusfix_native PRIVATE src include ${JNI_INCLUDE_DIRS})
target_link_libraries(campusfix_native PRIVATE ${JNI_LIBRARIES} JPEG::JPEG PNG::PNG PkgConfig::WEBP)

add_executable(campusfix_native_bench
    src/main.cpp
    src/assignment_algorithm.cpp
)
target_include_directories(campusfix_native_bench PRIVATE src include)

enable_testing()

add_executable(campusfix_native_tests
    tests/native_tests.cpp
    src/assignment_algorithm.cpp
    src/image_compressor.cpp
)
target_include_directories(campusfix_native_tests PRIVATE src include)
target_link_libraries(campusfix_native_tests PRIVATE JPEG::JPEG PNG::PNG PkgConfig::WEBP)

add_test(NAME campusfix_native_tests COMMAND campusfix_native_tests)
