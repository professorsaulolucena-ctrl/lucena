export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.APP_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: "O serviço de IA ainda não foi configurado no servidor." });
  try {
    const p = req.body || {};
    const required = ["subject", "topic", "quantity", "format", "complexity", "condition", "reading", "writing", "math", "communication"];
    if (!required.every(k => p[k] !== undefined && String(p[k]).trim() !== "")) {
      return res.status(400).json({ error: "Preencha disciplina, conteúdo e perfil pedagógico." });
    }
    const count = Math.max(3, Math.min(15, Number(p.quantity) || 5));
    const profile = {
      disciplina: String(p.subject).slice(0, 100), conteudo: String(p.topic).slice(0, 500),
      quantidade: count, formato: String(p.format).slice(0, 80), complexidade: String(p.complexity).slice(0, 80),
      turma: String(p.grade).slice(0, 80), idadeCronologica: String(p.age || "").slice(0, 40),
      idadeDesenvolvimento: String(p.development || "").slice(0, 40), condicao: String(p.condition).slice(0, 100),
      nivelSuporte: String(p.support || "").slice(0, 40), leitura: String(p.reading).slice(0, 120),
      escrita: String(p.writing).slice(0, 120), matematica: String(p.math).slice(0, 120),
      comunicacao: String(p.communication).slice(0, 120), interesses: String(p.interests || "").slice(0, 500),
      potencialidades: String(p.strengths || "").slice(0, 500), barreirasEApoios: String(p.barriers || "").slice(0, 500),
      observacoes: String(p.notes || "").slice(0, 500)
    };
    const schema = {
      type: "object", additionalProperties: false, required: ["title", "objective", "instructions", "questions"],
      properties: {
        title: { type: "string" }, objective: { type: "string" }, instructions: { type: "string" },
        questions: { type: "array", items: {
          type: "object", additionalProperties: false,
          required: ["prompt", "responseType", "options", "correctAnswer", "teacherSupport", "imageDescription"],
          properties: {
            prompt: { type: "string" },
            responseType: { type: "string", enum: ["marcar", "ligar", "circular", "ordenar", "completar", "resposta_curta"] },
            options: { type: "array", items: { type: "string" } },
            correctAnswer: { type: "string" },
            teacherSupport: { type: "string" },
            imageDescription: { type: "string" }
          }
        }}
      }
    };
    const instructions = [
      "Você é especialista em educação inclusiva, desenho universal para aprendizagem e elaboração de atividades acessíveis alinhadas ao currículo brasileiro.",
      "Crie uma atividade de qualidade editorial, pedagogicamente correta e diretamente vinculada ao conteúdo informado. Não crie perguntas genéricas nem repita moldes.",
      "Priorize tarefas visuais e práticas: comandos curtos, uma ação por questão, poucas palavras, alternativas simples e apoio por imagens. Não infantilize o estudante; respeite a idade cronológica e o conteúdo curricular.",
      "Adapte a forma de acesso e resposta, não reduza automaticamente o objetivo curricular. Considere potencialidades, interesses, comunicação, barreiras e apoios informados.",
      "Para cada questão, escreva uma descrição concreta de uma ilustração pedagógica necessária para resolvê-la. A descrição deve ser visual, específica, sem texto, letras ou números na imagem.",
      "Use 2 ou 3 alternativas quando múltipla escolha for apropriada. Para ligar, circular, ordenar e completar, deixe options vazio ou com os elementos necessários. Não invente diagnósticos nem trate idade de desenvolvimento como limite.",
      "teacherSupport deve orientar o profissional de apoio a apresentar o comando, oferecer pista graduada, aguardar resposta e registrar o nível de ajuda, sem responder pelo estudante.",
      "A resposta correta deve ser clara para o professor. Escreva em português brasileiro."
    ].join(" ");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.5",
        instructions,
        input: "Elabore a atividade usando este perfil pedagógico: " + JSON.stringify(profile),
        text: { format: { type: "json_schema", name: "adapted_activity", strict: true, schema } },
        max_output_tokens: 7000
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Activity API error", response.status, data?.error?.code || data?.error?.type || "unknown");
      return res.status(response.status >= 500 ? 502 : response.status).json({ error: "Não foi possível elaborar a atividade. Verifique o serviço de IA." });
    }
    const output = data.output?.flatMap(item => item.content || []).find(item => item.type === "output_text")?.text || data.output_text;
    if (!output) return res.status(502).json({ error: "A IA não retornou uma atividade válida." });
    const activity = JSON.parse(output);
    if (!Array.isArray(activity.questions) || activity.questions.length !== count) return res.status(502).json({ error: "A atividade retornada não passou na validação." });
    return res.status(200).json({ activity });
  } catch (error) {
    console.error("Activity generation failed", error?.message || "unknown");
    return res.status(500).json({ error: "Falha ao elaborar a atividade. Tente novamente." });
  }
}
