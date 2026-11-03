import './style.css';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const $ = (id) => document.getElementById(id);
const state = {
  screen: 'home', kind: 'Atividade', subject: 'Língua Portuguesa', topic: '',
  quantity: '5', format: 'Texto e imagens', complexity: 'A IA define',
  student: '', grade: '', age: '', development: '', condition: 'TEA', support: 'Nível 1',
  reading: 'Reconhece letras', writing: 'Escreve com apoio',
  math: 'Reconhece números até 10', communication: 'Comunica-se verbalmente',
  interests: '', strengths: '', barriers: '', notes: '', questions: [], images: {}, apiBase: localStorage.getItem('adapta-api-base') || '', generatedByAI: false, title: '', objective: ''
};
const subjects = ['Língua Portuguesa','Matemática','Ciências','História','Geografia','Inglês','Arte','Educação Física','Ensino Religioso','Outra'];
const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const select = (id, values, selected) => `<select id="${id}">${values.map(v=>`<option ${v===selected?'selected':''}>${esc(v)}</option>`).join('')}</select>`;
const input = (id, label, value, placeholder='') => `<label for="${id}">${label}</label><input class="field" id="${id}" value="${esc(value)}" placeholder="${placeholder}">`;
const area = (id, label, value, placeholder='') => `<label for="${id}">${label}</label><textarea id="${id}" placeholder="${placeholder}">${esc(value)}</textarea>`;

function frame(content) {
  $('app').innerHTML = `<div class="app">
    <header class="hero"><div class="brand"><div><div class="logo">ADAPTA<span>+</span></div><div class="tagline">Assistente pedagógico inclusivo</div></div><div class="brand-icon">✦</div></div>
    <h1>Atividades que respeitam cada jeito de aprender.</h1><p>Planeje adaptações com foco nas habilidades, nos interesses e nas necessidades de cada estudante.</p></header>
    ${content}
    <nav class="bottom-nav"><button data-nav="home">⌂<small>Início</small></button><button data-nav="form">✎<small>Criar</small></button><button data-nav="history">▤<small>Histórico</small></button></nav>
  </div>`;
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const v=b.dataset.nav;v==='form'?showForm():v==='history'?showHistory():showHome();});
}
function showHome(){
  state.screen='home';
  frame(`<div class="section-title">O que vamos preparar hoje?</div>
  <div class="grid">
    <button class="tile" data-kind="Atividade"><span class="tile-mark">01</span><b>Criar atividade</b><small>Questões e propostas adaptadas</small></button>
    <button class="tile" data-kind="Avaliação"><span class="tile-mark">02</span><b>Criar avaliação</b><small>Instrumentos avaliativos acessíveis</small></button>
    <button class="tile" data-kind="Prova"><span class="tile-mark">03</span><b>Criar prova</b><small>Provas com diferentes formatos</small></button>
    <button class="tile" id="go-history"><span class="tile-mark">04</span><b>Minhas atividades</b><small>Consulte os materiais salvos</small></button>
  </div>
  <section class="panel"><h2>Como funciona</h2><div class="how"><b>01</b><span><strong>Informe o conteúdo</strong><small>Disciplina, tema e quantidade de questões.</small></span></div><div class="how"><b>02</b><span><strong>Descreva o estudante</strong><small>Habilidades atuais, interesses e apoios necessários.</small></span></div><div class="how"><b>03</b><span><strong>Revise e exporte</strong><small>Edite a proposta e salve em Word ou PDF.</small></span></div></section>
  <div class="note">O ADAPTA+ apoia o planejamento docente. Toda proposta precisa ser revisada pelo professor e alinhada ao currículo e à avaliação pedagógica do estudante.</div>`);
  document.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{state.kind=b.dataset.kind;showForm();});
  $('go-history').onclick=showHistory;
}
function showForm(){
  state.screen='form';
  frame(`<div class="progress"><i class="on"></i><i class="on"></i><i class="on"></i></div>
  <div class="section-title">1. Conteúdo da atividade</div>
  <section class="panel">
    <label>Tipo de material</label>${select('kind',['Atividade','Avaliação','Prova'],state.kind)}
    <label>Disciplina</label>${select('subject',subjects,state.subject)}
    ${area('topic','Conteúdo / tema trabalhado',state.topic,'Ex.: Figuras de linguagem: metáfora e comparação')}
    <div class="row"><div><label>Quantidade de questões</label>${select('quantity',['3','5','8','10','12','15','20'],state.quantity)}</div><div><label>Formato</label>${select('format',['Texto e imagens','Somente texto','Predominantemente visual'],state.format)}</div></div>
    <label>Nível de complexidade</label>${select('complexity',['A IA define','Muito simples','Simples','Intermediário'],state.complexity)}\n    ${input('api-base','Servidor seguro de IA',state.apiBase,'https://seu-projeto.vercel.app')}
  </section>
  <div class="section-title">2. Perfil pedagógico do estudante</div>
  <section class="panel">
    <div class="row"><div>${input('student','Nome (opcional)',state.student,'Nome do estudante')}</div><div>${input('grade','Ano / turma',state.grade,'Ex.: 6º ano')}</div></div>
    <div class="row"><div>${input('age','Idade cronológica',state.age,'Ex.: 10 anos')}</div><div>${input('development','Desenvolvimento estimado (opcional)',state.development,'Ex.: 5 anos')}</div></div>
    <label>Deficiência / condição</label>${select('condition',['TEA','Deficiência Intelectual','Deficiência Física','Deficiência Visual','Deficiência Auditiva','TDAH','Deficiência Múltipla','Síndrome de Down','Outra'],state.condition)}
    <div id="support-box"><label>Nível de suporte (TEA)</label>${select('support',['Nível 1','Nível 2','Nível 3','Não informado'],state.support)}</div>
    <label>Leitura</label>${select('reading',['Ainda não reconhece letras','Reconhece letras','Lê sílabas','Lê palavras','Lê frases','Lê pequenos textos','Lê e interpreta textos'],state.reading)}
    <label>Escrita</label>${select('writing',['Ainda não escreve convencionalmente','Escreve com apoio','Copia palavras','Escreve palavras','Escreve frases','Produz pequenos textos'],state.writing)}
    <label>Conhecimentos matemáticos</label>${select('math',['Ainda em construção','Reconhece números até 10','Reconhece números até 100','Realiza operações simples','Resolve problemas matemáticos'],state.math)}
    <label>Comunicação</label>${select('communication',['Comunica-se verbalmente','Usa frases curtas','Usa comunicação alternativa','Comunica-se por Libras','Comunicação não verbal','Outra forma'],state.communication)}
    ${area('interests','Interesses e potencialidades',state.interests,'Ex.: gosta de animais, música, jogos, futebol...')}
    ${area('strengths','O que o estudante já consegue fazer?',state.strengths,'Descreva habilidades e conhecimentos observados.')}
    ${area('barriers','Barreiras e apoios necessários',state.barriers,'Ex.: comandos curtos, apoio visual, tempo ampliado...')}
    ${area('notes','Outras informações (opcional)',state.notes,'Informações pedagógicas úteis para planejar a atividade.')}
    <p class="muted">A idade de desenvolvimento é uma referência opcional, não um diagnóstico nem um limite de aprendizagem. Preserve a dignidade e a faixa etária do estudante.</p>
  </section>
  <button class="primary" id="generate">Preparar atividade adaptada</button>`);
  const ids=['kind','subject','topic','quantity','format','complexity','student','grade','age','development','condition','support','reading','writing','math','communication','interests','strengths','barriers','notes','api-base'];
  ids.forEach(id=>{const el=$(id);el.addEventListener('change',()=>{state[id]=el.value;if(id==='api-base'){state.apiBase=el.value.trim();localStorage.setItem('adapta-api-base',state.apiBase);}if(id==='condition')$('support-box').classList.toggle('hidden',el.value!=='TEA');});});
  $('support-box').classList.toggle('hidden',state.condition!=='TEA');
  $('generate').onclick=async()=>{ids.forEach(id=>{const el=$(id);if(el)state[id]=el.value;});if(!state.topic.trim()){alert('Informe o conteúdo trabalhado.');return;}state.apiBase=$('api-base').value.trim();localStorage.setItem('adapta-api-base',state.apiBase);await generateActivity();};
}
async function generateActivity() {
  const base = state.apiBase.replace(/\/$/, '');
  if (!base) { alert('Para gerar uma atividade profissional com IA, primeiro publique o servidor e informe sua URL.'); return; }
  const button = $('generate'); button.disabled = true; button.textContent = 'Elaborando atividade...';
  try {
    const response = await fetch(base + '/api/generate-activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...state, quantity: Number(state.quantity) }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Não foi possível gerar a atividade.');
    const activity = data.activity; state.title = activity.title; state.objective = activity.objective; state.generatedByAI = true; state.images = {};
    state.questions = activity.questions.map((q, i) => ({ number: i + 1, text: q.prompt, opts: q.options, answer: q.correctAnswer, teacherSupport: q.teacherSupport, imageDescription: q.imageDescription, responseType: q.responseType }));
    saveHistory(); showResult();
  } catch (error) { button.disabled = false; button.textContent = 'Preparar atividade adaptada'; alert(error.message || 'Falha na conexão com a IA.'); }
}
function buildDraftQuestions(){
  const t=state.topic.trim();
  const bank=[
    {text:`Qual alternativa apresenta uma ideia relacionada ao conteúdo “${t}”?`,opts:[`Uma informação ligada a ${t}`,'Uma informação sem relação com o tema','Ainda preciso de ajuda']},
    {text:`Complete: Hoje estamos aprendendo sobre ______.`,opts:[t,'Um assunto diferente','Não sei']},
    {text:`O que devemos observar quando estudamos ${t}?`,opts:['As características e exemplos do conteúdo','Somente a cor da página','Um assunto que não foi trabalhado']},
    {text:`Escolha um exemplo que pode ser usado para conversar sobre ${t}.`,opts:['Um exemplo explicado pelo professor','Uma palavra sem relação com o tema','Nenhuma das opções']},
    {text:`Depois da aula sobre ${t}, o que você consegue explicar?`,opts:['Uma ideia importante do conteúdo','Uma informação aleatória','Preciso de apoio para responder']}
  ];
  return Array.from({length:Number(state.quantity)},(_,i)=>({...bank[i%bank.length],number:i+1}));
}
function saveHistory(){
  const history=JSON.parse(localStorage.getItem('adapta-plus-history')||'[]');
  history.unshift({topic:state.topic,subject:state.subject,kind:state.kind,title:state.title,objective:state.objective,generatedByAI:state.generatedByAI,questions:state.questions,date:new Date().toLocaleDateString('pt-BR')});
  localStorage.setItem('adapta-plus-history',JSON.stringify(history.slice(0,40)));
}
function showResult(){
  state.screen='result';
  frame(`<div class="section-title">Sua atividade está pronta para revisão</div><section class="panel">
  <div class="result-head"><span class="badge">${state.generatedByAI ? "GERADA COM IA" : "RASCUNHO"}</span><h2>${esc(state.title||state.topic)}</h2><p class="muted">${esc(state.objective||"")}</p><p class="muted">${esc(state.subject)} • ${esc(state.kind)} • ${state.questions.length} questões</p></div>
  <p class="muted">Estudante: ${esc(state.student||'Não informado')} • ${esc(state.grade)}</p>
  ${state.questions.map(q=>`<div class="question"><b>${q.number}. ${esc(q.text)}</b>${q.teacherSupport?`<p class="teacher-support"><strong>Apoio ao profissional:</strong> ${esc(q.teacherSupport)}</p>`:""}<details class="answer-key"><summary>Ver gabarito</summary>${esc(q.answer||"Não informado")}</details><div class="image-slot" id="image-slot-${q.number}">${state.images[q.number] ? `<img class="worksheet-image" src="${state.images[q.number]}" alt="Ilustração pedagógica">` : ""}</div><div class="options">${q.opts.map((o,i)=>`<div class="option">${String.fromCharCode(65+i)}) ${esc(o)}</div>`).join('')}</div></div>`).join('')}
  <div class="ai-tools"><label for="api-base">Endereço do servidor de IA</label><input class="field" id="api-base" placeholder="https://seu-projeto.vercel.app" value="${esc(localStorage.getItem('adapta-api-base')||import.meta.env.VITE_API_BASE_URL||'')}"><p class="muted">A chave de IA fica protegida no servidor, nunca dentro do APK.</p><button class="secondary full" id="generate-images">Gerar ilustrações pedagógicas com IA</button><p class="muted" id="image-status">As imagens serão criadas para as questões, sem emojis, letras ou marcas d’água.</p></div><div class="note">Revise a adequação curricular, a resposta esperada e o nível de apoio antes de aplicar. A IA auxilia o planejamento; a decisão pedagógica é do professor.</div>
  <div class="row"><button class="secondary" id="export-word">Baixar Word</button><button class="primary" id="export-pdf">Baixar PDF</button></div>
  <button class="secondary full" id="edit">Voltar e editar</button></section>`);
  $('edit').onclick=showForm;$('export-pdf').onclick=exportPDF;$('export-word').onclick=exportWord;$('generate-images').onclick=generateImages;
}
async function saveBlob(blob, filename) {
  try {
    if (Capacitor.isNativePlatform()) {
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      const saved = await Filesystem.writeFile({ path: filename, data: btoa(binary), directory: Directory.Cache });
      await Share.share({ title: filename, text: 'Arquivo criado pelo ADAPTA+', url: saved.uri, dialogTitle: 'Salvar ou compartilhar arquivo' });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    console.error('Export error', error);
    alert('Não foi possível salvar o arquivo. Tente novamente.');
  }
}

async function generateImages() {
  const base = $('api-base').value.trim().replace(/\/$/, '');
  if (!base) { alert('Informe o endereço do servidor de IA publicado.'); return; }
  localStorage.setItem('adapta-api-base', base);
  const button = $('generate-images'), status = $('image-status');
  button.disabled = true; button.textContent = 'Gerando ilustrações...';
  try {
    const selected = state.questions.slice(0, 8);
    for (let i = 0; i < selected.length; i++) {
      const q = selected[i]; status.textContent = 'Criando imagem ' + (i + 1) + ' de ' + selected.length + '...';
      const response = await fetch(base + '/api/generate-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: state.subject, topic: state.topic, question: q.text, imageDescription: q.imageDescription || q.text }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Falha ao gerar imagem.');
      state.images[q.number] = data.image;
      const slot = $('image-slot-' + q.number); if (slot) slot.innerHTML = '<img class="worksheet-image" alt="Ilustração pedagógica" src="' + data.image + '">';
    }
    status.textContent = selected.length + ' ilustrações geradas. Confira se representam corretamente as questões.';
  } catch (error) { status.textContent = error.message || 'Não foi possível gerar as imagens.'; alert(status.textContent); }
  finally { button.disabled = false; button.textContent = 'Gerar ilustrações pedagógicas com IA'; }
}
async function exportPDF(){
  const pdf=new jsPDF();let y=18;
  pdf.setFont('helvetica','bold');pdf.setFontSize(18);pdf.text('ADAPTA+ | '+state.kind,14,y);y+=10;
  pdf.setFont('helvetica','normal');pdf.setFontSize(11);
  for(const line of [`Conteúdo: ${state.topic}`,`Disciplina: ${state.subject}`,`Estudante: ${state.student||'________________________'}`,`Turma: ${state.grade||'________________'}`]){const lines=pdf.splitTextToSize(line,180);pdf.text(lines,14,y);y+=lines.length*6+2;}
  y+=4;
  state.questions.forEach(q=>{const lines=pdf.splitTextToSize(q.number+'. '+q.text,180);if(y+lines.length*6>275){pdf.addPage();y=18;}pdf.setFont('helvetica','bold');pdf.text(lines,14,y);y+=lines.length*6+2;pdf.setFont('helvetica','normal');q.opts.forEach((o,i)=>{if(y>280){pdf.addPage();y=18;}pdf.text(String.fromCharCode(65+i)+') '+o,20,y);y+=7;});if(state.images[q.number]){if(y+65>280){pdf.addPage();y=18;}pdf.addImage(state.images[q.number],'PNG',20,y,62,62);y+=67;}y+=4;});
  await saveBlob(pdf.output('blob'),'ADAPTA-atividade-adaptada.pdf');
}
async function exportWord(){
  const children=[new Paragraph({text:'ADAPTA+ | '+state.kind,heading:HeadingLevel.TITLE}),new Paragraph({children:[new TextRun({text:'Conteúdo: ',bold:true}),new TextRun(state.topic)]}),new Paragraph('Disciplina: '+state.subject),new Paragraph('Estudante: '+(state.student||'________________________')),new Paragraph('Turma: '+(state.grade||'________________'))];
  state.questions.forEach(q=>{children.push(new Paragraph({text:q.number+'. '+q.text,heading:HeadingLevel.HEADING_2}));q.opts.forEach((o,i)=>children.push(new Paragraph(String.fromCharCode(65+i)+') '+o)));if(state.images[q.number]){const raw=atob(state.images[q.number].split(',')[1]);const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));children.push(new Paragraph({children:[new ImageRun({data:bytes,transformation:{width:320,height:320}})]}));}});
  children.push(new Paragraph({children:[new TextRun({text:'Material demonstrativo: revise e ajuste conforme a avaliação pedagógica do estudante.',italics:true})]}));
  const blob=await Packer.toBlob(new Document({sections:[{children}]}));await saveBlob(blob,'ADAPTA-atividade-adaptada.docx');
}
function showHistory(){
  state.screen='history';const h=JSON.parse(localStorage.getItem('adapta-plus-history')||'[]');
  frame(`<div class="section-title">Histórico de atividades</div>${h.length?h.map((x,i)=>`<section class="panel"><b>${esc(x.topic)}</b><p class="muted">${esc(x.subject)} • ${esc(x.kind)} • ${x.questions.length} questões • ${esc(x.date)}</p><button class="secondary" data-open="${i}">Abrir</button></section>`).join(''):'<section class="panel muted">Nenhuma atividade salva neste dispositivo ainda.</section>'}`);
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const x=h[Number(b.dataset.open)];state.topic=x.topic;state.subject=x.subject;state.kind=x.kind;state.title=x.title||x.topic;state.objective=x.objective||'';state.generatedByAI=!!x.generatedByAI;state.questions=x.questions;state.images={};showResult();});
}
showHome();
