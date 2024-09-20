import { Hono } from "hono/tiny";

import "@phala/wapo-env";
import { handle } from "@phala/wapo-env/guest";

import { getChatCompletion, prompt } from "./chat";

export const app = new Hono();

app.get("/prompt", (context) => context.json(prompt));
app.post("/", async (context) => {
  const data = await context.req.json();
  if (!data.messages) {
    return context.json({
      status: "error",
      message: "Required message body missing",
    });
  }

  let vault: Record<string, string> = {};
  try {
    vault = JSON.parse(process.env.secret || "");
  } catch (e) {
    return context.json({
      status: "error",
      message: "Failed to parse secrets",
    });
  }

  if (!vault.apiKey) {
    return context.json({
      status: "error",
      message: "API key secret missing",
    });
  }

  const response = await getChatCompletion(
    vault.apiKey,
    data.model || "gpt-4o",
    data.messages
  );

  return context.json(response);
});

export default handle(app);
