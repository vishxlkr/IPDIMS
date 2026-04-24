#!/bin/bash

# Open backend
mintty -e bash -c "cd server && npm run dev; exec bash" &

# Open client
mintty -e bash -c "cd client && npm run dev; exec bash" &

# Open admin
mintty -e bash -c "cd admin && npm run dev; exec bash" &








