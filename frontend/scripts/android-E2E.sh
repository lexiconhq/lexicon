#!/bin/bash

# Run expo client
cd frontend
yarn start:android:test &>/dev/null &
EXPO_PID=$!

# Run detox
yarn tests:android:test
DETOX_EXIT_CODE=$?

kill $EXPO_PID

exit $DETOX_EXIT_CODE
