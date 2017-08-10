#!/bin/sh
curl -X POST -H "Content-Type: application/json" \
-H "Cache-Control: no-cache" \
-d '{
    "source_url": "http://34.199.123.158/wp-cron.php?export_hash=d853a0888264258c&export_id=4&action=get_data",
    "file_prefix": "carlsonhotels",
    "host": "engine.postingworks.net",
    "port": "21",
    "user": "my-username",
    "pass": "my-password"
}' \
"https://us-central1-functions-176316.cloudfunctions.net/transfer_jobs"
