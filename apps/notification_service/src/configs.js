import dotenv from 'dotenv';

dotenv.config();

export const configs = {
    email_user : process.env.APP_USER,
    email_pass : process.env.APP_PASS
}