import transporter from "./mailconfig.js";

export const sendMail = async (email, content) => {
    try {
  const info = await transporter.sendMail({
    from: '"Example Team" <team@example.com>',
    to: email,
    subject: "Hello", 
    text: content, 
    html: `<b>${content}</b>`, 
  });

  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}
}

