FROM quay.io/debezium/connect:3.7.1.Final

USER root

RUN find /kafka/connect \
    -mindepth 1 \
    -maxdepth 1 \
    -type d \
    ! -name 'debezium-connector-postgres' \
    -exec rm -rf {} +

USER kafka