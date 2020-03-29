#!/bin/bash

# Create the config.js to provide client run-time config variables
C=server/public/js/config.js
SERVER_URL=`[ -z "$SERVER_URL" ] && echo "http://localhost:3060" || echo "$SERVER_URL"` 
SOLR_URL=`[ -z "$SOLR_URL" ] && echo "https://b2note.eudat.eu/solr/b2note_index/select" || echo "$SOLR_URL"` 
echo -n "window.b2note = { serverUrl: '"$SERVER_URL"', solrUrl: '"$SOLR_URL"' };" > $C

echo "$C created"
echo "Starting the server..."

cd server; npm run start