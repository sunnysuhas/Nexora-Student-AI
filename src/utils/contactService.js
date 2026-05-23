const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export async function sendContactMessage(payload) {
  if (!formspreeEndpoint) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return {
      simulated: true,
      message: "Message saved locally. Add VITE_FORMSPREE_ENDPOINT to send through Formspree.",
    };
  }

  const response = await fetch(formspreeEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      _replyto: payload.email,
      to: "sunnysuhas108@gmail.com",
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to send message. Please try again.");
  }

  return response.json();
}
