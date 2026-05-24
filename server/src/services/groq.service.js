export async function askGroq({ messages, context }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Groq API key is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are Nexora AI, a student productivity planner. Only help with study plans, task priority, deadlines, attendance, exams, goals, reminders, focus sessions, and weekly productivity. If asked unrelated questions, briefly redirect to student planning. Be specific, concise, and base recommendations on the provided student data.",
        },
        { role: "system", content: context },
        ...messages,
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) throw new Error("Groq request failed");
  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || "No response generated." };
}
