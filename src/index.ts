import { Hono } from "hono/tiny";
import { cors } from "hono/cors";

import "@phala/wapo-env";
import { handle } from "@phala/wapo-env/guest";

import { getChatCompletion } from "./chat";

export const app = new Hono();

app.use("*", cors());
app.get("/", async (context) => {
  const query = await context.req.queries("messages");
  if (!query || query.length === 0) {
    return context.json({
      status: "error",
      message: "Required message query missing",
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

  const messages = JSON.parse(query[0]);
  const response = await getChatCompletion(vault.apiKey, messages);
  return context.json(response);
});

export default handle(app);
