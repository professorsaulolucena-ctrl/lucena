# ADAPTA+ — aplicativo Android

Aplicativo móvel de apoio à elaboração de atividades inclusivas.

## Funcionalidades desta versão
- Interface responsiva e navegação inicial.
- Formulário de disciplina, tema, quantidade e formato.
- Perfil pedagógico: condição/deficiência, suporte no TEA, idade, leitura, escrita, matemática, comunicação, interesses, potencialidades e barreiras.
- Rascunhos demonstrativos de questões.
- Histórico local.
- Exportação em Word (.docx) e PDF.
- Compilação Android automatizada pelo GitHub Actions.

## Limitação funcional
A geração de questões nesta versão é demonstrativa. A integração com IA real ainda não foi configurada. Para isso, será necessário um backend seguro com credencial de provedor de IA armazenada no servidor; nunca incluir chave secreta no APK.

## Compilar
O workflow **Build ADAPTA+ APK** é executado em cada envio à branch main ou manualmente na aba Actions. Ao terminar com sucesso, baixe o artefato **ADAPTA-plus-debug-apk** na execução. O ZIP contém app-debug.apk.

APK debug é para teste e instalação manual. Distribuição pública exige assinatura de release.

## Privacidade
Evite dados pessoais identificáveis e informações clínicas desnecessárias. O histórico desta versão fica localmente no dispositivo.
