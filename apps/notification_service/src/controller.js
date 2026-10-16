import { sendMail } from "./service.js";

export const sendNotification = async (req, res) => {
    const {email, content} = req.body;
    const response  = await sendMail(email, content);
    console.log(response)
    res.status(200).send()

}