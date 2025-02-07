#!/bin/bash

# Start client and server in parallel
(cd client && npm run dev) &
(cd server && npm run server) &

# Wait for all background processes to finish
wait