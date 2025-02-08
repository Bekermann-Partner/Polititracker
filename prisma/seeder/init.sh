#!/bin/bash

load_csv_if_empty() {
    local table=$1
    local file=$2  # Second parameter is the CSV file name

    echo "Checking: '${table}'"

    # Check if the table is empty
    local row_count=$(mysql --host="${MYSQL_HOST}" --user=${MYSQL_USERNAME} --password=${MYSQL_PASSWORD} --database=${MYSQL_DATABASE} --batch --skip-column-names -e "SELECT COUNT(*) FROM ${table};")
    row_count=${row_count:-0}

    if [ "$row_count" -eq 0 ]; then
        echo "Table '${table}' is empty. Importing data from ${file}..."
        mysql --local-infile=1 --host="${MYSQL_HOST}" --user=${MYSQL_USERNAME} --password=${MYSQL_PASSWORD} --database=${MYSQL_DATABASE} <<EOF
LOAD DATA LOCAL INFILE '/tmp/data/${file}'
INTO TABLE ${table}
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
EOF
        echo "Data imported into '${table}'."
    else
        echo "Table '${table}' is not empty. Skipping import for ${file}."
    fi
}

echo "USER ${MYSQL_USERNAME}"
echo "PASSWD ${MYSQL_PASSWORD}"
echo "DATABASE ${MYSQL_DATABASE}"

ls /tmp/data

# Load CSV files only if the corresponding table is empty
load_csv_if_empty "Party" "Party.csv"
load_csv_if_empty "Politician" "Politician.csv"
load_csv_if_empty "User" "User.csv"

# Exit the container gracefully
echo "CSV files loaded. Shutting down..."
