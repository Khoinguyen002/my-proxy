import axios from "axios";

export const sendMail = async ({
  env,
  html,
  subject,
  to,
}: {
  env: Env;
  to: string;
  subject: string;
  html: string;
}) => {
  const apiKey = env.MAILERSEND_API_KEY;

  const res = await axios("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },

    data: {
      from: {
        email: "no-reply@" + env.MAILERSEND_DOMAIN,
      },
      to: [{ email: to }],
      subject,
      html,
    },
  });

  console.log("Success send mail to: " + to);

  return res;
};
