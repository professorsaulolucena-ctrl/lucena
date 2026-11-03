# ADAPTA+ — aplicativo Android

Aplicativo de apoio à produção de materiais pedagógicos acessíveis.

## Funcionalidades implementadas no código
- Formulário de conteúdo e perfil pedagógico.
- Geração de atividades contextualizadas por IA, com comandos curtos, tarefas visuais, objetivos, gabarito e orientações para o profissional de apoio.
- Geração de ilustrações pedagógicas individuais por IA, sem texto embutido, emojis ou clipart.
- Inclusão das ilustrações no PDF e no Word.
- Histórico local.
- Exportação PDF e Word; no Android, os arquivos são preparados no armazenamento temporário e abertos no menu nativo de compartilhamento/salvamento.

## Configuração obrigatória do serviço de IA

O aplicativo usa a OpenAI API por meio de funções serverless da Vercel. A chave **não deve ser colocada no APK, no JavaScript do aplicativo ou no repositório**.

1. Importe este repositório em uma conta Vercel e publique o projeto.
2. Nas configurações do projeto Vercel, adicione a variável de ambiente `OPENAI_API_KEY` com uma chave da OpenAI API.
3. Faça um novo deploy para aplicar a variável.
4. No ADAPTA+, informe a URL pública do projeto Vercel no campo **Servidor seguro de IA**.
5. Gere a atividade. Depois, na tela de revisão, use **Gerar ilustrações pedagógicas com IA**.

A geração de texto usa GPT-5.5 e a geração de imagens usa GPT Image 2.5 Sunburst. A conta OpenAI API precisa ter acesso e faturamento habilitados; o uso pode gerar custos. A disponibilidade do modelo pode depender da verificação da organização.

As funções incluem um limite básico de solicitações por endereço IP em memória. Em implantação pública, recomenda-se acrescentar um serviço persistente de rate limit, autenticação de usuário e monitoramento de custos.

## Exportação no Android

O aplicativo usa os plugins nativos Capacitor Filesystem e Share para preparar o PDF/Word e abrir o menu Android de compartilhamento ou salvamento. No navegador, usa download de arquivo com URL temporária.

## Compilação Android

O workflow **Build ADAPTA+ APK** é executado em envios à branch `main`. Quando uma execução terminar com sucesso, baixe o artefato `ADAPTA-plus-debug-apk` na página da execução. O ZIP contém `app-debug.apk`.

O APK debug é para teste e instalação manual. A distribuição pública exige assinatura de release. A compilação ainda precisa ser confirmada no GitHub Actions.

## Revisão pedagógica e privacidade

A IA produz uma proposta, não substitui a avaliação pedagógica do professor. Confira o alinhamento curricular, a correção das respostas, a adequação das imagens e os apoios indicados antes de aplicar.

Informe somente dados pedagógicos necessários. Evite nomes completos, documentos, endereços e informações clínicas desnecessárias. O histórico desta versão fica armazenado localmente no dispositivo.
