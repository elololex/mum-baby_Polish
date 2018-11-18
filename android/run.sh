#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.imagineear.mumandbaby.android/host.exp.exponent.MainActivity
