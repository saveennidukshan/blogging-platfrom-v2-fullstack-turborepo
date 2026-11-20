import "dotenv/config";

export const configs = {
    app_name: process.env.APP_NAME || "auth-api",
    app_port: process.env.APP_PORT || 3000,
    db_connection_string: process.env.DATABASE_URL,
    jwt_access_secret: process.env.JWT_AUTH_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_auth_expires_in: process.env.JWT_AUTH_EXPIRES_IN || "15m",
    jwt_rf_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    jwt_issuer: process.env.JWT_ISS || "auth-service",
    kafka_url: process.env.KAFKA_CONN_URL || "localhost:9092",
    app_environment: process.env.APP_ENV || "production"
}

export default configs;