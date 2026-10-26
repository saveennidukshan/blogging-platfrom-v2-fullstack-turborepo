import "dotenv/config";

export const configs = {
    app_name: process.env.APP_NAME || "auth-api",
    app_port: process.env.APP_PORT || 3000,
    db_connection_string: process.env.DATABASE_URL,
    jwt_secret_key: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
    kafka_url: process.env.KAFKA_CONN_URL,
    app_environment: process.env.APP_ENV || "prod"
}

export default configs;