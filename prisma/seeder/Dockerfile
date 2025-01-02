# Use a lightweight Alpine image
FROM alpine:3.18

# Install MySQL client and required tools
RUN apk add --no-cache mysql-client bash

# Set environment variables for MySQL setup (values provided in .env file)
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=your_database_name

WORKDIR /tmp

COPY *.csv /tmp/data/

# Copy initialization script to Docker entrypoint
COPY init.sh /tmp/init.sh
RUN chmod +x /tmp/init.sh

CMD ["/bin/bash", "/tmp/init.sh"]