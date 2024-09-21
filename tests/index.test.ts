import { describe, expect, it, vi } from "vitest";
import { app } from "../src/";

const apiKey = JSON.stringify({
  apiKey: "sk-q2w8m0zbDrz9iOYxA69TkPMSMVZcw7WijMPWEoAK3exBRvjV",
});

vi.stubEnv("secret", apiKey);
describe("Geeg LLM Agent Contract", () => {
  it("Should allow CORS for all origins", async () => {
    const messages = [
      {
        role: "user",
        content: "I want to create a logo for my cafe",
      },
    ];

    const res = await app.request(`/?messages=${JSON.stringify(messages)}`);

    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("Should initiate requirement gathering", async () => {
    const messages = [
      {
        role: "user",
        content: "I want to create a logo for my cafe",
      },
    ];

    const res = await app.request(`/?messages=${JSON.stringify(messages)}`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")?.toLowerCase()).toBe(
      "application/json; charset=utf-8"
    );

    const data = await res.json();
    expect(data).toHaveProperty("role");
    expect(data.role).toBe("assistant");
    expect(data).toHaveProperty("content");
  });

  it("Should generate requirement as JSON", async () => {
    const messages = [
      {
        role: "user",
        content: "I want to create a logo for my cafe",
      },
      {
        role: "assistant",
        content:
          "That sounds exciting! Can you describe the type of logo you're envisioning? Any specific elements, style, or colors you'd like incorporated?",
      },
      {
        role: "user",
        content:
          "I want the logo to be green and also have leaf elements. The logo should be minimalistic and modern",
      },
      {
        role: "assistant",
        content:
          "Great choice! A minimalistic and modern green logo with leaf elements will make your cafe stand out. \n\nAre there any particular fonts or typography styles you'd prefer? Also, would you like the logo to include the name of your cafe or any specific text?",
      },
      {
        role: "user",
        content:
          'No preference. The brand is "Kopi Sore", I\'m open to either adding it to the logo or not',
      },
      {
        role: "assistant",
        content:
          'Understood. We have a minimalistic and modern green logo with leaf elements, possibly incorporating the name "Kopi Sore".\n\nAre there any specific deadlines or timeframes you\'re aiming for this project?',
      },
      {
        role: "user",
        content: "I need it by next month",
      },
      {
        role: "assistant",
        content:
          "Got it, so we have a month to develop the logo.\n\nWhat kind of experience are you looking for in a freelancer? For instance, would you prefer someone who has extensive experience in graphic design and logo creation?",
      },
      {
        role: "user",
        content: "Not really, just someone who have a good track record",
      },
      {
        role: "assistant",
        content:
          "Understood. You're looking for someone with a solid track record in graphic design and logo creation.\n\nNow, what is your overall budget for this project?",
      },
      {
        role: "user",
        content: "I have $200 max",
      },
      {
        role: "assistant",
        content:
          'Thank you for providing your budget. Let me summarize the project details we\'ve gathered so far:\n\n**Skills needed:** graphic design, logo creation.\n**Style:** Minimalistic and modern.\n**Color scheme:** Green with leaf elements.\n**Text preference:** Possibly including the name "Kopi Sore", open to both options.\n**Time estimate:** Approximately 20 hours (inferred based on the project\'s nature and minimalistic design).\n**Deadline:** 30 days.\n**Budget:** $200.\n**Hourly rate:** $10/hour (inferred from budget and time estimate).\n**Experience level:** Good track record in graphic design and logo creation.\n\nHere\'s a summary of your project:\n- **Skills needed:** graphic design, logo creation.\n- **Time estimate:** 20 hours.\n- **Deadline:** 30 days.\n- **Budget:** $200.\n- **Hourly rate:** $10/hour.\n- **Experience level:** A freelancer with a good track record in graphic design and logo creation.\n- **Summary:** Create a minimalistic and modern green logo with leaf elements for "Kopi Sore", possibly including the name.\n\nDoes this summary look correct, or would you like to make any changes before I finalize it?',
      },
      {
        role: "user",
        content: "Looks good",
      },
    ];

    const res = await app.request(`/?messages=${JSON.stringify(messages)}`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")?.toLowerCase()).toBe(
      "application/json; charset=utf-8"
    );

    const data = await res.json();
    console.info(data);

    expect(data).toHaveProperty("role");
    expect(data.role).toBe("assistant");
    expect(data).toHaveProperty("content");

    const content = JSON.parse(data.content);
    expect(content).toHaveProperty("skills");
    expect(content).toHaveProperty("summary");
    expect(content).toHaveProperty("time_estimate");
    expect(content).toHaveProperty("deadline");
    expect(content).toHaveProperty("gigs");
    expect(content).toHaveProperty("rating");
  });
});
