# ADAPTA+ — aplicativo Android

Aplicativo de apoio à produção de materiais pedagógicos acessíveis.

## O que esta versão contém
- Interface responsiva para celular.
- Perfil pedagógico com habilidades, interesses, potencialidades, barreiras e apoios.
- Histórico local de atividades.
- Exportação de PDF e Word.
- Compartilhamento de arquivos no Android usando os recursos nativos do aparelho.
- Endpoint de servidor para criar ilustrações pedagógicas com IA.
- Inclusão das ilustrações geradas nos arquivos PDF e Word.

## Configurar geração de imagens por IA

A geração de imagens usa a OpenAI Image API no servidor. A chave **não deve ser colocada no APK, no JavaScript do aplicativo ou no repositório**.

1. Importe este repositório em uma conta Vercel e publique o projeto.
2. Nas configurações do projeto Vercel, adicione a variável de ambiente `OPENAI_API_KEY` com uma chave da API OpenAI.
3. Faça um novo deploy para aplicar a variável.
4. No ADAPTA+, informe a URL pública do projeto Vercel no campo **Endereço do servidor de IA**.
5. Use o botão **Gerar ilustrações pedagógicas com IA** na atividade.

A utilização da API de imagens pode gerar custos na conta da plataforma. É necessário ter acesso e faturamento habilitados na conta OpenAI API. A disponibilidade do modelo também depende da verificação da organização, quando exigida.

## Limitações que ainda precisam ser resolvidas

- A elaboração de questões ainda usa modelos demonstrativos; não está conectada a um gerador de questões por IA. Não aplique sem revisão docente.
- O servidor de imagens precisa ser publicado e configurado com a variável `OPENAI_API_KEY`.
- A compilação do APK precisa ser confirmada em uma execução concluída do GitHub Actions antes de afirmar que o instalador está pronto.
- O APK gerado pelo workflow é uma versão debug para teste, não uma versão assinada para distribuição pública.

## Compilar Android

O workflow **Build ADAPTA+ APK** roda em envios à branch `main`. Quando a execução terminar com sucesso, baixe o artefato `ADAPTA-plus-debug-apk` na página da execução. O ZIP contém `app-debug.apk`.

## Privacidade

O formulário deve conter apenas informações pedagógicas necessárias. Evite nomes completos, documentos, endereços e informações clínicas desnecessárias. O histórico é armazenado localmente no dispositivo.
