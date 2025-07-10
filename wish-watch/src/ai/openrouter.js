export const getSimilarMedia = async (userPrompt) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000/",
          "X-Title": "Mixed-Media-Recommender",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content:
                "You are a knowledgeable and conversational media assistant." +
                "When users mention a title, setting, or theme, first try to identify direct connections (e.g., spinoffs or adaptations)." +
                "Then suggest other media across different formats (anime, cartoons, movies, TV shows, books, games, music) that share similar themes, style, or tone." +
                "Respond in a helpful and conversational tone." +
                "Briefly explain your reasoning behind each suggestion, and feel free to ask the user questions to clarify what they're looking for.",
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    return data.choices?.[0]?.message?.content || "Sorry, no results.";
  } catch (err) {
    console.error("OpenRouter Error:", err);
    return "There was an error connecting to OpenRouter.";
  }
};
