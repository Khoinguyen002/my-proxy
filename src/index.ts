import { Hono } from "hono";
import { authSession } from "./middlewares/auth";
import { rateLimit } from "./middlewares/rateLimit";
import { sendMail } from "./services/mailService";

const app = new Hono<{ Bindings: Env }>();

app.use("*", rateLimit, authSession);

app.post("/send-mail", async (c) => {
  const body = await c.req.json();

  try {
    const res = await sendMail({ env: c.env, ...body });
    return c.json(res);
  } catch (error) {
    return c.json({ message: (error as any).message }, 404);
  }
});

export default app;
