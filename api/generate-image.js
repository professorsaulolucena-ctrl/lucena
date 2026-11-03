const rateLimits = new Map();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.APP_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  const limit = rateLimits.get(ip) || { start: now, count: 0 };
  if (now - limit.start > 60000) { limit.start = now; limit.count = 0; }
  if (limit.count >= 8) return res.status(429).json({ error: "Muitas solicitações. Aguarde um minuto e tente novamente." });
  limit.count += 1; rateLimits.set(ip, limit);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: "O serviço de imagens ainda não foi configurado no servidor." });
  try {
    const { subject, topic, question, imageDescription } = req.body || {};
    if (![subject, topic, question].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ error: "Informe disciplina, conteúdo e questão." });
    }
    const prompt = [
      "Create one exceptionally clear, professional educational illustration for an inclusive Brazilian school worksheet.",
      "The illustration must directly depict the learning concept in the question below.",
      "Visual direction: polished editorial educational illustration, realistic proportions, clean composition, excellent lighting, crisp edges, high detail, accessible visual hierarchy, uncluttered light background.",
      "Use a respectful, age-appropriate visual style. Do not make the student or subject look like a baby. No emojis, no clipart, no icons, no collage, no decorative filler.",
      "Do not include any text, letters, numbers, labels, logos, watermarks, or written symbols inside the image. Leave all instructional text to the worksheet layout.",
      "Subject: " + subject.trim().slice(0, 120),
      "Content: " + topic.trim().slice(0, 500),
      "Question context: " + question.trim().slice(0, 900),
      "Specific visual description: " + String(imageDescription || "").slice(0, 1200)
    ].join("\n");
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-image-2.5-flare",
        prompt,
        size: "1024x1024",
        quality: "high",
        output_format: "png",
        n: 1
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      console.error("Image API error", response.status, payload?.error?.code || payload?.error?.type || "unknown");
      return res.status(response.status >= 500 ? 502 : response.status).json({
        error: response.status === 429 ? "Limite de geração atingido. Tente novamente mais tarde." : "Não foi possível gerar a imagem. Verifique a configuração do serviço."
      });
    }
    const encoded = payload?.data?.[0]?.b64_json;
    if (!encoded) return res.status(502).json({ error: "O serviço não retornou uma imagem válida." });
    return res.status(200).json({ image: "data:image/png;base64," + encoded });
  } catch (error) {
    console.error("Image generation failed", error?.message || "unknown");
    return res.status(500).json({ error: "Falha ao gerar a imagem. Tente novamente." });
  }
}
