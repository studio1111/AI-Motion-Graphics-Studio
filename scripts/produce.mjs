#!/usr/bin/env node
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { delimiter, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const LAYOUTS = new Set(["hero","editorial","diagram","timeline","compare","data","particles","map","interface","quote","outro"]);
export const SUPPORTED_LANGUAGES = new Set(["fa","en","de","es","fr","it","pt","nl"]);
export const PRESETS = {
"editorial-kinetic-type":{label:"Editorial Kinetic Type",palette:{background:"#111114",foreground:"#F2EFE8",muted:"#A8A6A0",accent:"#F04D35",accent2:"#D9C35B",panel:"#25252B",line:"#55535B"},typography:{display:"Barlow Condensed, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"data-journalism":{label:"Data Journalism",palette:{background:"#101A2A",foreground:"#EDF2F8",muted:"#A9B8CB",accent:"#28C4A5",accent2:"#FFB84A",panel:"#1B2A3E",line:"#40516A"},typography:{display:"IBM Plex Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"scientific-2-5d":{label:"Scientific 2D / 2.5D",palette:{background:"#071E2B",foreground:"#E8F5F6",muted:"#A2C4CD",accent:"#50D9C8",accent2:"#5B9CFF",panel:"#123240",line:"#2F5C6A"},typography:{display:"Manrope, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"cinematic-documentary":{label:"Cinematic Documentary",palette:{background:"#171916",foreground:"#E9E0CD",muted:"#BEB9AC",accent:"#C64B35",accent2:"#A6AF82",panel:"#282922",line:"#55584D"},typography:{display:"IBM Plex Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"tactile-collage":{label:"Tactile Collage",palette:{background:"#EFE5D1",foreground:"#242321",muted:"#68645B",accent:"#C84D39",accent2:"#788064",panel:"#E4D7BE",line:"#B9AA8F"},typography:{display:"Source Serif 4, Liberation Serif, serif",body:"IBM Plex Sans, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"premium-3d-product":{label:"Premium 3D Product",palette:{background:"#10151B",foreground:"#F2F5F7",muted:"#AAB5C0",accent:"#73E0C7",accent2:"#A7B7FF",panel:"#1A222C",line:"#394653"},typography:{display:"Manrope, Liberation Sans, sans-serif",body:"IBM Plex Sans, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"character-2d":{label:"Character-led 2D",palette:{background:"#F7F1E4",foreground:"#203449",muted:"#536474",accent:"#ED6B5C",accent2:"#E6B94C",panel:"#EEE4D3",line:"#C9C0B1"},typography:{display:"Nunito Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"swiss-modernist":{label:"Swiss Modernist",palette:{background:"#F3F3EF",foreground:"#171717",muted:"#5D5D5D",accent:"#E34234",accent2:"#275DDB",panel:"#E7E7E1",line:"#C8CBCB"},typography:{display:"IBM Plex Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"procedural-generative":{label:"Procedural Generative",palette:{background:"#080B17",foreground:"#DCE7FF",muted:"#98A8CB",accent:"#7EE7F5",accent2:"#B6A0FF",panel:"#151A2D",line:"#53617C"},typography:{display:"IBM Plex Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"maps-timeline":{label:"Maps Timeline",palette:{background:"#E9E3D4",foreground:"#293B36",muted:"#596963",accent:"#D95136",accent2:"#D9A441",panel:"#DCD5C3",line:"#B4B6A8"},typography:{display:"IBM Plex Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"vertical-social":{label:"Vertical Social",palette:{background:"#08090B",foreground:"#FFFFFF",muted:"#A4ABB5",accent:"#FF4E73",accent2:"#B8F49A",panel:"#191C22",line:"#3A3E46"},typography:{display:"Barlow Condensed, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}},
"hybrid-live-action":{label:"Hybrid Live Action",palette:{background:"#10212D",foreground:"#F4F7FA",muted:"#B5C6D0",accent:"#00A6D8",accent2:"#FFBE0B",panel:"#1D3442",line:"#48606D"},typography:{display:"IBM Plex Sans, Liberation Sans, sans-serif",body:"Source Sans 3, Liberation Sans, sans-serif",mono:"IBM Plex Mono, Liberation Mono, monospace"}}
};
const ALIASES={editorial:"editorial-kinetic-type",kinetic:"editorial-kinetic-type",data:"data-journalism",infographic:"data-journalism",science:"scientific-2-5d",scientific:"scientific-2-5d",documentary:"cinematic-documentary",cinematic:"cinematic-documentary",collage:"tactile-collage",product3d:"premium-3d-product","3d":"premium-3d-product",character2d:"character-2d",swiss:"swiss-modernist",generative:"procedural-generative",timeline:"maps-timeline",maps:"maps-timeline",vertical:"vertical-social",hybrid:"hybrid-live-action"};
const LAYOUTS_BY_STYLE={
"editorial-kinetic-type":["hero","editorial","quote","compare","editorial","particles","quote","outro"],
"data-journalism":["hero","data","compare","diagram","timeline","data","quote","outro"],
"scientific-2-5d":["hero","diagram","particles","diagram","compare","data","timeline","outro"],
"cinematic-documentary":["hero","editorial","timeline","map","quote","compare","particles","outro"],
"tactile-collage":["hero","editorial","map","timeline","quote","compare","particles","outro"],
"premium-3d-product":["hero","interface","diagram","particles","compare","data","quote","outro"],
"character-2d":["hero","editorial","diagram","timeline","compare","quote","particles","outro"],
"swiss-modernist":["hero","diagram","timeline","compare","data","interface","quote","outro"],
"procedural-generative":["hero","particles","diagram","data","compare","particles","quote","outro"],
"maps-timeline":["hero","map","timeline","map","compare","data","quote","outro"],
"vertical-social":["hero","editorial","compare","diagram","data","quote","particles","outro"],
"hybrid-live-action":["hero","interface","editorial","diagram","compare","timeline","quote","outro"]
};
const COPY={
fa:{subtitle:"روایتی تصویری از پرسش تا درک",rows:[
["پرسش اصلی","پشتِ «{topic}» چه پرسشی پنهان است؟","برای ساختن روایتی روشن، ابتدا باید مشخص کنیم مخاطب چه چیزی را بفهمد.","ابتدا موضوع را به یک پرسش دقیق تبدیل می‌کنیم. همین پرسش مسیر صحنه‌های بعدی را مشخص می‌کند.",["پرسش","زمینه","پاسخ"]],
["زمینه","مسئله را از نزدیک ببینیم","جزئیات مهم را از اطلاعات فرعی جدا می‌کنیم تا اصل موضوع روشن بماند.","مرزهای موضوع را مشخص می‌کنیم و آنچه برای فهم آن ضروری است از حاشیه‌ها جدا می‌شود.",["تمرکز","زمینه","اهمیت"]],
["ساختار","اجزای سیستم را جدا کن","نمایش رابطه میان اجزا می‌تواند از یک فهرست اطلاعات روشن‌تر باشد.","به جای انباشتن اطلاعات، اجزا را جدا می‌کنیم و پیوند میان آن‌ها را دیداری نشان می‌دهیم.",["ورودی","فرایند","خروجی"]],
["حرکت","تغییر را دنبال کن","ترتیب و پیامد زمانی بهتر فهمیده می‌شوند که هر مرحله حالت تصویری مشخصی داشته باشد.","مسیر تغییر را مرحله‌به‌مرحله دنبال می‌کنیم. هر حرکت باید بخشی از توضیح را آشکار کند.",["شروع","تغییر","نتیجه"]],
["مقایسه","مسیرهای متفاوت را کنار هم بگذار","وقتی دو وضعیت با معیار مشترک دیده شوند، تفاوت‌ها واضح‌تر می‌شوند.","مقایسه باید معیار روشن داشته باشد. آمار واقعی نیز به منبع و واحد تأییدشده نیاز دارد.",["وضعیت اول","وضعیت دوم","تفاوت"]],
["نشانه‌ها","نشانه‌ها را درست بخوان","نمودارها به تعریف، مقیاس و منبع نیاز دارند تا معنای مشخصی داشته باشند.","این تصویر نموداری مفهومی است و داده اندازه‌گیری‌شده نیست. آمار واقعی باید تأیید شود.",["الگو","زمینه","اطمینان"]],
["ترکیب","قطعات تصویر را به هم وصل کن","یک روایت خوب، جزئیات را به نتیجه‌ای مشخص پیوند می‌دهد.","پرسش آغازین، ساختار موضوع و مسیر تغییر را به یک توضیح منسجم وصل می‌کنیم.",["جزئیات","رابطه","برداشت"]],
["جمع‌بندی","ایدهٔ اصلی را به خاطر بسپار","حرکت باید به فهم کمک کند، نه اینکه جایگزین شواهد و توضیح شود.","این نسخه یک قالب مفهومی خودکار است. مستند واقعی پیش از انتشار به تحقیق و تأیید منابع نیاز دارد.",["وضوح","دقت","هدف"]]
]},
en:{subtitle:"A visual journey from question to understanding",rows:[
["THE QUESTION","What question sits behind {topic}?","A clear visual story starts by deciding what the audience should understand.","Turn the topic into a precise question. That question guides every scene that follows.",["Question","Context","Answer"]],
["THE CONTEXT","See the problem up close","Separate essential signals from supporting detail so the idea stays legible.","Set the boundaries of the subject and separate what matters from what distracts.",["Focus","Context","Stakes"]],
["THE SYSTEM","Break the system into parts","A visible relationship often explains more than a list of disconnected facts.","Show the parts and their relationships instead of stacking information.",["Input","Process","Outcome"]],
["THE CHANGE","Follow the change over time","Sequence and consequences become clearer when each step has a distinct visual state.","Follow the process one step at a time. Each movement should reveal part of the explanation.",["Start","Change","Result"]],
["THE COMPARISON","Put different paths side by side","A shared scale makes two states easier to compare.","Compare against clear criteria. Real statistics need verified sources and units.",["First state","Second state","Difference"]],
["THE SIGNAL","Read the signal carefully","Charts and numbers need a definition, scale and source to mean anything.","This conceptual graphic is not measured data. Replace it with verified values when needed.",["Pattern","Context","Confidence"]],
["THE CONNECTION","Connect the pieces","A strong narrative connects details to a specific conclusion.","Bring the opening question, system and change together into one clear explanation.",["Details","Relation","Insight"]],
["THE TAKEAWAY","Keep the central idea","Motion should help the audience understand, not replace evidence.","This is a conceptual template. A factual documentary still needs research and source verification.",["Clarity","Accuracy","Purpose"]]
]},

de:{subtitle:"Eine visuelle Reise von der Frage zum Verständnis",rows:[
["DIE FRAGE","Welche Frage steckt hinter {topic}?","Eine klare visuelle Geschichte beginnt damit, festzulegen, was das Publikum verstehen soll.","Wir übersetzen das Thema zuerst in eine präzise Frage. Diese Frage führt durch die folgenden Szenen.",["Frage","Kontext","Antwort"]],
["DER KONTEXT","Das Problem aus der Nähe betrachten","Trennen Sie wesentliche Hinweise von ergänzenden Details, damit die Idee verständlich bleibt.","Wir grenzen das Thema ab und trennen das Wesentliche von Ablenkungen.",["Fokus","Kontext","Bedeutung"]],
["DAS SYSTEM","Das System in Teile zerlegen","Sichtbare Beziehungen erklären oft mehr als eine Liste unverbundener Fakten.","Wir zeigen die Bestandteile und ihre Beziehungen, statt Informationen nur zu sammeln.",["Eingabe","Prozess","Ergebnis"]],
["DIE VERÄNDERUNG","Der Veränderung folgen","Abläufe und Folgen werden klarer, wenn jeder Schritt einen eigenen visuellen Zustand erhält.","Wir verfolgen den Prozess Schritt für Schritt. Jede Bewegung soll etwas erklären.",["Beginn","Wandel","Ergebnis"]],
["DER VERGLEICH","Unterschiedliche Wege nebeneinanderstellen","Ein gemeinsamer Maßstab macht zwei Zustände besser vergleichbar.","Ein Vergleich braucht klare Kriterien. Reale Zahlen brauchen geprüfte Quellen und Einheiten.",["Zustand A","Zustand B","Unterschied"]],
["DAS SIGNAL","Signale sorgfältig lesen","Diagramme und Zahlen brauchen Definition, Maßstab und Quelle, um etwas auszusagen.","Diese Grafik ist konzeptionell und zeigt keine Messdaten. Verwenden Sie reale Werte erst nach Prüfung.",["Muster","Kontext","Sicherheit"]],
["DER ZUSAMMENHANG","Die Teile verbinden","Eine starke Erzählung verbindet Details mit einer klaren Schlussfolgerung.","Wir verbinden die Ausgangsfrage, das System und die Veränderung zu einer verständlichen Erklärung.",["Details","Beziehung","Erkenntnis"]],
["DIE KERNAUSSAGE","Die zentrale Idee behalten","Bewegung soll das Verständnis unterstützen, nicht Belege ersetzen.","Dies ist eine konzeptionelle Vorlage. Ein faktenbasierter Beitrag braucht Recherche und geprüfte Quellen.",["Klarheit","Genauigkeit","Ziel"]]
]},
es:{subtitle:"Un viaje visual de la pregunta a la comprensión",rows:[
["LA PREGUNTA","¿Qué pregunta hay detrás de {topic}?","Una historia visual clara empieza por definir qué debe entender el público.","Primero convertimos el tema en una pregunta precisa. Esa pregunta guía las escenas siguientes.",["Pregunta","Contexto","Respuesta"]],
["EL CONTEXTO","Miremos el problema de cerca","Separa las señales esenciales de los detalles secundarios para mantener clara la idea.","Delimitamos el tema y separamos lo esencial de lo que distrae.",["Enfoque","Contexto","Importancia"]],
["EL SISTEMA","Descompón el sistema","Mostrar relaciones puede explicar más que una lista de hechos aislados.","Mostramos las partes y sus relaciones en lugar de acumular información.",["Entrada","Proceso","Resultado"]],
["EL CAMBIO","Sigue el cambio en el tiempo","La secuencia y las consecuencias se entienden mejor cuando cada paso tiene un estado visual propio.","Seguimos el proceso paso a paso. Cada movimiento debe revelar parte de la explicación.",["Inicio","Cambio","Resultado"]],
["LA COMPARACIÓN","Pon los caminos lado a lado","Una escala compartida facilita comparar dos estados.","Comparamos con criterios claros. Los datos reales necesitan fuentes y unidades verificadas.",["Estado A","Estado B","Diferencia"]],
["LA SEÑAL","Lee la señal con cuidado","Los gráficos necesitan definición, escala y fuente para comunicar algo fiable.","Este gráfico es conceptual, no representa datos medidos. Solo añadiremos cifras después de verificarlas.",["Patrón","Contexto","Confianza"]],
["LA CONEXIÓN","Une las piezas","Una narración sólida conecta los detalles con una conclusión concreta.","Unimos la pregunta inicial, la estructura y el cambio en una explicación coherente.",["Detalles","Relación","Idea clave"]],
["LA IDEA CLAVE","Recuerda la idea central","El movimiento debe facilitar la comprensión, no reemplazar las pruebas.","Esto es una plantilla conceptual. Un documental factual necesita investigación y fuentes verificadas.",["Claridad","Precisión","Objetivo"]]
]},
fr:{subtitle:"Un parcours visuel de la question à la compréhension",rows:[
["LA QUESTION","Quelle question se cache derrière {topic} ?","Un récit visuel clair commence par définir ce que le public doit comprendre.","Nous transformons d’abord le sujet en une question précise. Elle guidera les scènes suivantes.",["Question","Contexte","Réponse"]],
["LE CONTEXTE","Voir le problème de près","Séparez les éléments essentiels des détails secondaires pour préserver la clarté de l’idée.","Nous délimitons le sujet et distinguons l’essentiel de ce qui détourne l’attention.",["Priorité","Contexte","Enjeu"]],
["LE SYSTÈME","Décomposer le système","Des relations visibles expliquent souvent mieux qu’une liste de faits sans liens.","Nous montrons les composants et leurs relations au lieu d’empiler l’information.",["Entrée","Processus","Résultat"]],
["LE CHANGEMENT","Suivre l’évolution","La séquence et les conséquences sont plus claires lorsque chaque étape a son propre état visuel.","Nous suivons le processus étape par étape. Chaque mouvement doit éclairer une partie de l’explication.",["Départ","Évolution","Résultat"]],
["LA COMPARAISON","Placer les options côte à côte","Une échelle commune facilite la comparaison de deux situations.","La comparaison exige des critères clairs. Les chiffres réels nécessitent des sources et des unités vérifiées.",["État A","État B","Écart"]],
["LE SIGNAL","Lire le signal avec soin","Les graphiques et les nombres ont besoin d’une définition, d’une échelle et d’une source.","Ce graphique est conceptuel et ne représente pas des mesures. Les valeurs réelles doivent être vérifiées.",["Motif","Contexte","Confiance"]],
["LE LIEN","Relier les éléments","Un récit solide relie les détails à une conclusion précise.","Nous réunissons la question initiale, la structure et le changement dans une explication cohérente.",["Détails","Relation","Idée clé"]],
["À RETENIR","Garder l’idée centrale","Le mouvement doit aider à comprendre, pas remplacer les preuves.","Ceci est un modèle conceptuel. Un documentaire factuel exige recherche et sources vérifiées.",["Clarté","Précision","Objectif"]]
]},
it:{subtitle:"Un percorso visivo dalla domanda alla comprensione",rows:[
["LA DOMANDA","Quale domanda si nasconde dietro {topic}?","Una storia visiva chiara parte da ciò che il pubblico dovrebbe capire.","Trasformiamo prima il tema in una domanda precisa. Questa domanda guiderà le scene successive.",["Domanda","Contesto","Risposta"]],
["IL CONTESTO","Guardiamo il problema da vicino","Separiamo i segnali essenziali dai dettagli secondari per mantenere chiara l’idea.","Definiamo i confini del tema e distinguiamo ciò che conta dalle distrazioni.",["Fuoco","Contesto","Rilevanza"]],
["IL SISTEMA","Scomponi il sistema","Rendere visibili le relazioni spesso spiega più di un elenco di fatti scollegati.","Mostriamo le parti e i loro rapporti invece di accumulare informazioni.",["Ingresso","Processo","Risultato"]],
["IL CAMBIAMENTO","Segui il cambiamento nel tempo","Sequenza e conseguenze sono più chiare quando ogni passaggio ha uno stato visivo distinto.","Seguiamo il processo un passo alla volta. Ogni movimento deve rivelare una parte della spiegazione.",["Inizio","Cambiamento","Risultato"]],
["IL CONFRONTO","Metti a confronto percorsi diversi","Una scala comune rende due situazioni più facili da confrontare.","Il confronto richiede criteri chiari. I dati reali hanno bisogno di fonti e unità verificate.",["Stato A","Stato B","Differenza"]],
["IL SEGNALE","Leggi il segnale con attenzione","Grafici e numeri richiedono definizione, scala e fonte per avere significato.","Questo grafico è concettuale e non mostra dati misurati. I valori reali vanno verificati.",["Schema","Contesto","Affidabilità"]],
["IL COLLEGAMENTO","Collega i pezzi","Una narrazione solida collega i dettagli a una conclusione precisa.","Uniamo la domanda iniziale, la struttura e il cambiamento in una spiegazione coerente.",["Dettagli","Relazione","Idea chiave"]],
["IL MESSAGGIO","Ricorda l’idea centrale","Il movimento deve aiutare a capire, non sostituire le prove.","Questo è un modello concettuale. Un documentario fattuale richiede ricerca e fonti verificate.",["Chiarezza","Precisione","Obiettivo"]]
]},
pt:{subtitle:"Uma jornada visual da pergunta à compreensão",rows:[
["A PERGUNTA","Que pergunta está por trás de {topic}?","Uma história visual clara começa ao definir o que o público precisa compreender.","Primeiro transformamos o tema em uma pergunta precisa. Ela orienta as cenas seguintes.",["Pergunta","Contexto","Resposta"]],
["O CONTEXTO","Veja o problema de perto","Separe os sinais essenciais dos detalhes secundários para manter a ideia clara.","Delimitamos o tema e separamos o essencial daquilo que distrai.",["Foco","Contexto","Importância"]],
["O SISTEMA","Divida o sistema em partes","Mostrar relações costuma explicar mais do que uma lista de fatos desconectados.","Mostramos as partes e suas relações em vez de apenas acumular informações.",["Entrada","Processo","Resultado"]],
["A MUDANÇA","Acompanhe a mudança ao longo do tempo","A sequência e as consequências ficam mais claras quando cada etapa tem um estado visual próprio.","Acompanhamos o processo passo a passo. Cada movimento deve revelar parte da explicação.",["Início","Mudança","Resultado"]],
["A COMPARAÇÃO","Coloque caminhos diferentes lado a lado","Uma escala comum facilita comparar dois estados.","A comparação precisa de critérios claros. Dados reais exigem fontes e unidades verificadas.",["Estado A","Estado B","Diferença"]],
["O SINAL","Leia o sinal com atenção","Gráficos e números precisam de definição, escala e fonte para comunicar algo concreto.","Este gráfico é conceitual e não representa dados medidos. Valores reais só entram após verificação.",["Padrão","Contexto","Confiança"]],
["A CONEXÃO","Conecte as partes","Uma narrativa forte conecta detalhes a uma conclusão específica.","Conectamos a pergunta inicial, a estrutura e a mudança em uma explicação coerente.",["Detalhes","Relação","Ideia central"]],
["A IDEIA-CHAVE","Guarde a ideia central","O movimento deve facilitar a compreensão, não substituir as evidências.","Este é um modelo conceitual. Um documentário factual exige pesquisa e fontes verificadas.",["Clareza","Precisão","Objetivo"]]
]},
nl:{subtitle:"Een visuele reis van vraag naar inzicht",rows:[
["DE VRAAG","Welke vraag zit achter {topic}?","Een helder visueel verhaal begint bij wat de kijker moet begrijpen.","We maken van het onderwerp eerst een precieze vraag. Die vraag stuurt de scènes die volgen.",["Vraag","Context","Antwoord"]],
["DE CONTEXT","Bekijk het probleem van dichtbij","Scheid de belangrijkste signalen van details die de kern minder duidelijk maken.","We bakenen het onderwerp af en scheiden de kern van afleiding.",["Focus","Context","Belang"]],
["HET SYSTEEM","Splits het systeem op in delen","Zichtbare verbanden leggen vaak meer uit dan een lijst losse feiten.","We tonen de onderdelen en hun verbanden in plaats van informatie op te stapelen.",["Invoer","Proces","Uitkomst"]],
["DE VERANDERING","Volg de verandering door de tijd","Volgorde en gevolgen zijn duidelijker wanneer elke stap een eigen visuele toestand heeft.","We volgen het proces stap voor stap. Elke beweging moet een deel van de uitleg onthullen.",["Start","Verandering","Resultaat"]],
["DE VERGELIJKING","Zet verschillende routes naast elkaar","Een gedeelde schaal maakt twee situaties makkelijker vergelijkbaar.","Vergelijken vraagt om duidelijke criteria. Echte cijfers hebben gecontroleerde bronnen en eenheden nodig.",["Situatie A","Situatie B","Verschil"]],
["HET SIGNAAL","Lees het signaal zorgvuldig","Grafieken en getallen vragen om een definitie, schaal en bron om iets te betekenen.","Deze grafiek is conceptueel en toont geen gemeten gegevens. Echte waarden worden eerst gecontroleerd.",["Patroon","Context","Betrouwbaarheid"]],
["HET VERBAND","Verbind de onderdelen","Een sterk verhaal verbindt details met een duidelijke conclusie.","We brengen de beginvraag, de structuur en de verandering samen in één heldere uitleg.",["Details","Verband","Inzicht"]],
["DE KERN","Onthoud het centrale idee","Beweging moet begrip ondersteunen en mag bewijs niet vervangen.","Dit is een conceptueel sjabloon. Een feitelijke documentaire heeft onderzoek en gecontroleerde bronnen nodig.",["Helderheid","Nauwkeurigheid","Doel"]]
]}
};

export function parseArgs(argv=process.argv.slice(2),env=process.env){
  const o={topic:env.MOTION_TOPIC||"",language:env.MOTION_STUDIO_LANGUAGE||"fa",duration:Number(env.MOTION_STUDIO_DURATION||90),style:env.MOTION_STUDIO_STYLE||"auto",aspectRatio:env.MOTION_STUDIO_ASPECT_RATIO||"16:9",voice:env.MOTION_STUDIO_VOICE||"auto",allowPaidAI:["1","true","yes"].includes(String(env.MOTION_STUDIO_ALLOW_PAID_API||"").toLowerCase()),planOnly:false,outputDir:env.MOTION_STUDIO_OUTPUT_DIR||"out",briefPath:"",sourcesPath:"",skipResearch:false,help:false};
  const map=new Map([["--topic","topic"],["--language","language"],["--duration","duration"],["--style","style"],["--aspect-ratio","aspectRatio"],["--voice","voice"],["--output-dir","outputDir"],["--brief","briefPath"],["--sources","sourcesPath"]]);
  for(let i=0;i<argv.length;i++){const arg=argv[i];if(arg==="--allow-paid-ai"){o.allowPaidAI=true;continue;}if(arg==="--plan-only"||arg==="--skip-render"){o.planOnly=true;continue;}if(arg==="--no-research"){o.skipResearch=true;continue;}if(arg==="--help"||arg==="-h"){o.help=true;continue;}const flag=arg.includes("=")?arg.slice(0,arg.indexOf("=")):arg;const inline=arg.includes("=")?arg.slice(arg.indexOf("=")+1):undefined;const key=map.get(flag);if(!key)throw new Error("Unknown option: "+arg);const value=inline===undefined?argv[++i]:inline;if(value===undefined||value==="")throw new Error("Missing value for "+flag);o[key]=key==="duration"?Number(value):value;}
  o.language=String(o.language).toLowerCase().split("-")[0];o.style=String(o.style).toLowerCase().replaceAll("_","-").replaceAll(" ","-");o.aspectRatio=String(o.aspectRatio).replace(/\s+/g,"");o.voice=String(o.voice).toLowerCase();
  if(!SUPPORTED_LANGUAGES.has(o.language))throw new Error("Language must be one of: "+Array.from(SUPPORTED_LANGUAGES).join(", ")+".");
  if(!["auto","off","pocket-tts","persian-speech"].includes(o.voice))throw new Error("Voice must be auto, off, pocket-tts, or persian-speech.");
  if(!["16:9","9:16","1:1"].includes(o.aspectRatio))throw new Error("Aspect ratio must be 16:9, 9:16, or 1:1.");
  if(!Number.isFinite(o.duration)||o.duration<5||o.duration>3600)throw new Error("Duration must be between 5 and 3600 seconds (one hour).");
  return o;
}
export function safeSlug(value){const slug=String(value||"motion-video").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-+|-+$/g,"").slice(0,48);return slug||"motion-video";}
export function detectTopicVisualFamily(topic){
 const text=String(topic||"").toLowerCase();
 const city=/(\b(?:city|cities|urban|metro|downtown)\b|شهر|شهری|کلان‌شهر|مرکز شهر)/i.test(text);
 const heat=/(\b(?:heat|heatwave|thermal|temperature|hotter|hot|heat island)\b|گرما|حرارت|دما|جزیره گرمایی)/i.test(text);
 if(city&&heat)return "city-heat";
 if(/(artificial intelligence|machine learning|neural network|\bai\b|robot|هوش مصنوعی|یادگیری ماشین|شبکه عصبی|ربات)/i.test(text))return "artificial-intelligence";
 if(/(solar|photovoltaic|renewable energy|wind power|electricity|power grid|خورشید|خورشیدی|برق|انرژی|نیروگاه|باد)/i.test(text))return "solar-energy";
 if(/(climate|global warming|carbon|emissions|ecosystem|environment|اقلیم|گرمایش جهانی|کربن|انتشار گاز|محیط زیست|بوم‌سازگان)/i.test(text))return "climate";
 if(/(biology|cell|dna|gene|virus|protein|medical|health|زیست‌شناسی|سلول|دی‌ان‌ای|ژن|ویروس|پروتئین|پزشکی|سلامت)/i.test(text))return "biology";
 if(/(space|planet|orbit|universe|galaxy|black hole|astronomy|فضا|سیاره|مدار|کیهان|کهکشان|سیاهچاله|نجوم)/i.test(text))return "space";
 if(/(finance|financial|market|economy|inflation|budget|stock|money|اقتصاد|مالی|بازار|تورم|بودجه|سهام|پول)/i.test(text))return "finance";
 if(/(cyber|security|encryption|privacy|password|phishing|هک|امنیت سایبری|رمزنگاری|حریم خصوصی|گذرواژه|فیشینگ)/i.test(text))return "cybersecurity";
 if(/(ocean|water cycle|river|rainfall|drought|water|اقیانوس|چرخه آب|رودخانه|بارندگی|خشکسالی|آب)/i.test(text))return "water";
 if(city)return "city";
 return "general";
}
export function chooseStyle(style,topic,ratio="16:9"){
  const id=String(style||"auto").toLowerCase().replaceAll("_","-").replaceAll(" ","-");
  if(id!=="auto"){const found=ALIASES[id]||id;if(!PRESETS[found])throw new Error("Unknown style: "+style);return found;}
  if(ratio==="9:16")return "vertical-social";const t=String(topic||"").toLowerCase();
  if(/(statistic|data|chart|graph|econom|market|budget|survey|آمار|اقتصاد|نمودار|داده)/i.test(t))return "data-journalism";
  if(/(history|historical|timeline|map|migration|war|تاریخ|نقشه|مهاجرت|جنگ)/i.test(t))return "maps-timeline";
  if(/(science|physics|biology|medical|space|climate|quantum|علم|فیزیک|زیست|فضا|اقلیم|کیهان)/i.test(t))return "scientific-2-5d";
  if(/(product|device|robot|software|technology|artificial intelligence|ai|محصول|دستگاه|ربات|فناوری|هوش مصنوعی)/i.test(t))return "premium-3d-product";
  if(/(culture|memory|archive|identity|فرهنگ|خاطره|آرشیو|هویت)/i.test(t))return "tactile-collage";
  return "cinematic-documentary";
}
export function allocateFrames(scenes,totalFrames,fps=30){
  if(!Array.isArray(scenes)||!scenes.length)throw new Error("At least one scene is required.");
  if(!Number.isInteger(totalFrames)||totalFrames<scenes.length)throw new Error("Total frames must be at least the number of scenes.");
  const min=Math.min(Math.max(1,Math.round(fps*1.5)),Math.floor(totalFrames/scenes.length));const remaining=totalFrames-min*scenes.length;
  const weights=scenes.map(s=>Math.max(1,Math.min(140,[s.title,s.body,s.narration].filter(Boolean).join(" ").trim().split(/\s+/).filter(Boolean).length)));const sum=weights.reduce((a,b)=>a+b,0);const raw=weights.map(w=>remaining*w/sum);const result=raw.map(v=>min+Math.floor(v));let spare=totalFrames-result.reduce((a,b)=>a+b,0);
  const remainders=raw.map((v,i)=>({i,f:v-Math.floor(v)})).sort((a,b)=>b.f-a.f);for(let i=0;spare>0;i++,spare--)result[remainders[i%remainders.length].i]++;return result;
}
const TOPIC_STORIES = {
  en: {
    "city-heat": [
      { kicker:"THE QUESTION", title:"The city’s heat paths", body:"Follow energy between sunlight, rooftops, streets, shade and moving air.", narration:"A city heat story is a story of energy moving between the sun, buildings, streets and air. We trace those paths before deciding where a design change could matter.", bullets:["Sunlight","Surfaces","Airflow"] },
      { kicker:"THE SURFACE", title:"Sunlight meets the street", body:"Pavement, roofs, trees and shade create different local conditions.", narration:"Start with the ground and rooftops. Material and shade affect how energy is absorbed, reflected and released, so two nearby streets can behave differently.", bullets:["Pavement","Rooftops","Tree shade"] },
      { kicker:"THE AIRFLOW", title:"Follow the rising heat", body:"Building shape and open corridors influence how air can move.", narration:"Now follow the air between buildings. The moving lines are a conceptual model, not measured wind data. Their job is to make possible routes visible and invite a closer look at the street geometry.", bullets:["Building form","Air paths","Open corridors"] },
      { kicker:"THE SHADE", title:"Shade changes the path", body:"Trees, awnings and covered walkways alter a street’s exposure.", narration:"A shaded route receives a different mix of direct sunlight and surface heating. The important design question is where shade falls during the hours people actually use the street.", bullets:["Canopy","Awnings","People’s routes"] },
      { kicker:"THE NETWORK", title:"Blocks connect to one another", body:"Heat does not stop at a property line; streets form a connected system.", narration:"Zoom out from one building. Streets, courtyards, roofs and parks connect across a block, so a local change should be understood as part of a larger network.", bullets:["Street","Courtyard","Park"] },
      { kicker:"THE TIME", title:"The balance changes through the day", body:"Sun angle, shade and stored heat make timing part of the story.", narration:"The scene changes with the clock. A solution that helps one location at midday may behave differently later, which is why time belongs in the explanation rather than in a footnote.", bullets:["Morning","Midday","Evening"] },
      { kicker:"THE ROUTE", title:"Find a cooler route", body:"Combine shade, surface choices and connected green space.", narration:"Now follow a person’s route through the system. The goal is not a fictional temperature score: it is to compare design choices with clear criteria and verify any real-world performance claims.", bullets:["Continuous shade","Surface choice","Connected green space"] },
      { kicker:"THE DESIGN", title:"Design around the flow", body:"Make the energy and airflow paths visible before choosing interventions.", narration:"Bring the pieces together: sunlight, surfaces, shade, air and time. This is a conceptual storyboard; a factual documentary should add sourced local observations and reviewed measurements before drawing conclusions.", bullets:["Trace","Compare","Verify"] }
    ],
    "artificial-intelligence": [
      { kicker:"THE QUESTION", title:"Make the model visible", body:"Trace the path from input to pattern, model output and human decision.", narration:"An AI system is easier to understand when we follow the flow of information. This conceptual map follows inputs, learned patterns, outputs and the decisions people make around them.", bullets:["Input","Model","Decision"] },
      { kicker:"THE INPUT", title:"Signals become examples", body:"Training material shapes which patterns a system can learn.", narration:"Begin with examples and signals. Their source, coverage and quality influence what a model can learn, so the dataset is part of the system rather than a footnote.", bullets:["Examples","Coverage","Quality"] },
      { kicker:"THE MODEL", title:"Patterns form inside the system", body:"Connected layers transform input into a representation.", narration:"The model transforms signals through connected operations. The animated nodes are a visual metaphor, not a literal diagram of every architecture or parameter.", bullets:["Layers","Weights","Representation"] },
      { kicker:"THE OUTPUT", title:"A prediction is not a verdict", body:"Outputs need context, confidence and a defined use.", narration:"The model returns an output, but the output still needs interpretation. A score or generated response is not automatically correct, complete or appropriate for every setting.", bullets:["Prediction","Context","Limits"] },
      { kicker:"THE FEEDBACK", title:"Evaluation closes the loop", body:"Tests reveal failure modes that a smooth demo may hide.", narration:"Evaluation sends information back into the development process. Good tests include unfamiliar cases, uneven coverage and examples where a plausible answer is still wrong.", bullets:["Test cases","Failure modes","Review"] },
      { kicker:"THE HUMAN", title:"People stay in the loop", body:"A responsible workflow assigns ownership for consequential decisions.", narration:"Human oversight is not a decorative final step. People need a clear role, enough context to challenge the output and a way to intervene when the model is uncertain or wrong.", bullets:["Oversight","Accountability","Appeal"] },
      { kicker:"THE EDGE CASE", title:"Test where the pattern breaks", body:"Rare cases and changing inputs can expose hidden assumptions.", narration:"Move beyond the happy path. Try edge cases, changing conditions and inputs unlike the training examples, then document what the system cannot safely handle.", bullets:["Edge cases","Changing data","Known limits"] },
      { kicker:"THE TAKEAWAY", title:"Use intelligence with judgment", body:"A useful system combines capability, evaluation and clear boundaries.", narration:"The system is more than its model: data, tests, safeguards and human decisions shape the result. This is a conceptual template, so real performance claims must come from cited evidence.", bullets:["Capability","Evidence","Boundaries"] }
    ],
    "solar-energy": [
      { kicker:"THE SOURCE", title:"Follow sunlight to power", body:"Trace the path from incoming light through conversion and useful energy.", narration:"To explain solar electricity, follow the energy path from sunlight to a useful electrical output. Keep each conversion visible and distinguish the panel from the other parts of the system.", bullets:["Sunlight","Conversion","Useful power"] },
      { kicker:"THE PANEL", title:"Light reaches the cells", body:"Photovoltaic cells convert part of the incoming light into electrical energy.", narration:"The panel is the first visible stage. Its cells convert part of the incoming light into electrical energy, while the amount produced depends on conditions that need to be measured for a real installation.", bullets:["Light","Cells","Output"] },
      { kicker:"THE CURRENT", title:"Electricity takes a new form", body:"Power electronics prepare the panel’s output for the next stage.", narration:"Follow the electrical output toward the inverter and control electronics. This stage shapes how power is delivered; the visual sequence is schematic and not a wiring diagram.", bullets:["Panel output","Inverter","Control"] },
      { kicker:"THE SYSTEM", title:"Connect panels to a place", body:"Wiring, mounting, inverters and loads work as a coordinated system.", narration:"A panel alone is not the whole installation. Mounting, wiring, inverter, protection and the electrical load all affect the complete system and should be represented with the right level of detail.", bullets:["Mounting","Wiring","Inverter"] },
      { kicker:"THE DEMAND", title:"Match generation with use", body:"Energy demand changes over time and across locations.", narration:"Generation and demand do not always line up. Show when energy is produced and when it is needed, then use verified local data if the video compares actual output and demand.", bullets:["Generation","Demand","Timing"] },
      { kicker:"THE STORAGE", title:"Storage shifts energy in time", body:"A battery can store energy for later use, with system-specific limits.", narration:"Storage adds another path through time. Batteries, conversion losses, operating limits and safety controls matter, so a factual version should use specifications for the chosen system rather than generic promises.", bullets:["Charge","Store","Discharge"] },
      { kicker:"THE TRADE-OFF", title:"Measure more than output", body:"Cost, conditions, maintenance and grid rules shape real-world results.", narration:"A useful comparison asks more than how much power a panel can produce. Installation conditions, maintenance, costs, storage and grid requirements all change the practical decision.", bullets:["Conditions","Cost","Maintenance"] },
      { kicker:"THE TAKEAWAY", title:"See the whole energy path", body:"Understand the source, conversion, controls and end use together.", narration:"Put the whole path back together, from sunlight to the place electricity is used. This is a conceptual template; a factual version should cite the relevant technical standards and installation data.", bullets:["Source","Conversion","Use"] }
    ]
  },
  fa: {
    "city-heat": [
      { kicker:"پرسش اصلی", title:"مسیر حرکت گرما در شهر", body:"انرژی میان نور خورشید، پشت‌بام، خیابان، سایه و هوای در حال حرکت جابه‌جا می‌شود.", narration:"برای فهم گرمای شهر باید مسیر انرژی را میان خورشید، ساختمان‌ها، خیابان‌ها و هوا دنبال کنیم. اول این مسیرها را روشن می‌کنیم و بعد می‌پرسیم تغییر طراحی کجا می‌تواند مؤثر باشد.", bullets:["نور خورشید","سطوح","جریان هوا"] },
      { kicker:"سطح زمین", title:"نور خورشید به خیابان می‌رسد", body:"آسفالت، پشت‌بام، درخت و سایه شرایط محلی متفاوتی ایجاد می‌کنند.", narration:"از زمین و پشت‌بام شروع کنیم. جنس سطح و وجود سایه بر جذب، بازتاب و آزاد شدن انرژی اثر می‌گذارند؛ بنابراین دو خیابان نزدیک به هم هم لزوماً رفتار یکسانی ندارند.", bullets:["آسفالت","پشت‌بام","سایه درخت"] },
      { kicker:"جریان هوا", title:"مسیر حرکت هوای گرم را دنبال کن", body:"شکل ساختمان‌ها و گذرگاه‌های باز بر مسیر حرکت هوا اثر می‌گذارند.", narration:"حالا مسیر هوا را میان ساختمان‌ها دنبال کنیم. این خطوط یک مدل مفهومی‌اند، نه داده اندازه‌گیری‌شده باد. هدف آن‌ها نشان دادن مسیرهای احتمالی و توجه دادن ما به شکل و چیدمان خیابان است.", bullets:["شکل ساختمان","مسیر هوا","گذرگاه باز"] },
      { kicker:"سایه", title:"سایه مسیر گرما را تغییر می‌دهد", body:"درخت، سایه‌بان و مسیر سرپوشیده میزان تابش مستقیم را تغییر می‌دهند.", narration:"مسیر سایه‌دار ترکیب متفاوتی از نور مستقیم و گرمایش سطح را تجربه می‌کند. پرسش مهم این است که سایه در ساعت‌هایی که مردم واقعاً از خیابان استفاده می‌کنند، کجا قرار می‌گیرد.", bullets:["تاج درخت","سایه‌بان","مسیر مردم"] },
      { kicker:"شبکه شهری", title:"بلوک‌های شهری به هم متصل‌اند", body:"گرما در مرز یک ساختمان متوقف نمی‌شود؛ خیابان‌ها یک شبکه به‌هم‌پیوسته‌اند.", narration:"از یک ساختمان فاصله بگیریم. خیابان، حیاط، پشت‌بام و فضای سبز در سطح محله به هم وصل‌اند؛ پس هر تغییر محلی را باید در چارچوب شبکه بزرگ‌تر بررسی کرد.", bullets:["خیابان","حیاط","پارک"] },
      { kicker:"زمان", title:"تعادل گرما در طول روز تغییر می‌کند", body:"زاویه خورشید، سایه و گرمای ذخیره‌شده، زمان را به بخشی از مسئله تبدیل می‌کنند.", narration:"صحنه با ساعت روز تغییر می‌کند. راهکاری که ظهر در یک نقطه مفید است ممکن است در زمان دیگری رفتار متفاوتی داشته باشد. برای همین زمان باید بخشی از توضیح باشد، نه یک یادداشت حاشیه‌ای.", bullets:["صبح","ظهر","عصر"] },
      { kicker:"مسیر", title:"مسیر خنک‌تر را پیدا کن", body:"سایه پیوسته، انتخاب سطح و پیوند فضای سبز را کنار هم ببین.", narration:"حالا مسیر حرکت یک نفر را در این شبکه دنبال کنیم. هدف ساختن امتیاز دمایی خیالی نیست؛ باید گزینه‌های طراحی را با معیارهای روشن مقایسه کنیم و هر ادعای واقعی را بررسی کنیم.", bullets:["سایه پیوسته","جنس سطح","فضای سبز متصل"] },
      { kicker:"طراحی", title:"شهر را با جریان انرژی طراحی کن", body:"قبل از انتخاب راهکارها، مسیر انرژی و هوا را روشن کن.", narration:"اجزای ماجرا را کنار هم بگذاریم: نور خورشید، سطح، سایه، هوا و زمان. این یک الگوی مفهومی است؛ نسخه مستند باید مشاهده‌های محلی و داده‌های بررسی‌شده را به منابع معتبر متصل کند.", bullets:["ردیابی","مقایسه","اعتبارسنجی"] }
    ],
    "artificial-intelligence": [
      { kicker:"پرسش اصلی", title:"هوش مصنوعی را قابل مشاهده کن", body:"مسیر ورودی، الگو، خروجی مدل و تصمیم انسان را دنبال کن.", narration:"وقتی جریان اطلاعات را دنبال کنیم، فهم یک سیستم هوش مصنوعی ساده‌تر می‌شود. این نقشه مفهومی از ورودی‌ها به الگوهای یادگرفته‌شده، خروجی و تصمیم‌هایی می‌رسد که انسان‌ها پیرامون آن می‌گیرند.", bullets:["ورودی","مدل","تصمیم"] },
      { kicker:"ورودی", title:"نشانه‌ها به نمونه تبدیل می‌شوند", body:"منابع و پوشش داده‌ها بر الگوهایی که سیستم می‌آموزد اثر می‌گذارند.", narration:"از نمونه‌ها و داده‌ها شروع کنیم. منبع، گستره و کیفیت آن‌ها بر آنچه مدل می‌تواند بیاموزد اثر دارند؛ پس داده بخشی از خود سیستم است، نه یک یادداشت فرعی.", bullets:["نمونه‌ها","پوشش","کیفیت"] },
      { kicker:"مدل", title:"الگوها درون سیستم شکل می‌گیرند", body:"لایه‌های متصل، ورودی را به بازنمایی تازه‌ای تبدیل می‌کنند.", narration:"مدل از راه مجموعه‌ای از عملیات به‌هم‌پیوسته، نشانه‌ها را تبدیل می‌کند. گره‌های متحرک اینجا استعاره بصری‌اند و معماری یا همه پارامترهای یک مدل واقعی را نشان نمی‌دهند.", bullets:["لایه‌ها","وزن‌ها","بازنمایی"] },
      { kicker:"خروجی", title:"پیش‌بینی، حکم نهایی نیست", body:"خروجی به زمینه، میزان اطمینان و کاربرد تعریف‌شده نیاز دارد.", narration:"مدل یک خروجی می‌دهد، اما خروجی هنوز به تفسیر نیاز دارد. یک امتیاز یا پاسخ تولیدشده لزوماً درست، کامل یا مناسب همه موقعیت‌ها نیست.", bullets:["پیش‌بینی","زمینه","محدودیت"] },
      { kicker:"بازخورد", title:"ارزیابی، حلقه را کامل می‌کند", body:"آزمون‌ها خطاهایی را آشکار می‌کنند که نمایش کوتاه پنهان می‌ماند.", narration:"ارزیابی اطلاعات را به روند توسعه برمی‌گرداند. آزمون خوب فقط نمونه‌های آسان را بررسی نمی‌کند؛ موارد ناآشنا، پوشش نامتوازن و پاسخ‌های ظاهراً معقول اما نادرست را هم می‌سنجد.", bullets:["نمونه آزمون","حالت خطا","بازبینی"] },
      { kicker:"نقش انسان", title:"انسان همچنان در حلقه می‌ماند", body:"فرایند مسئولانه برای تصمیم‌های مهم، مسئولیت مشخص تعریف می‌کند.", narration:"نظارت انسان نباید صرفاً یک مرحله تزئینی در پایان باشد. افراد باید نقش روشن، زمینه کافی برای به چالش کشیدن خروجی و امکان مداخله در زمان عدم اطمینان یا خطا داشته باشند.", bullets:["نظارت","پاسخ‌گویی","اعتراض"] },
      { kicker:"حالت مرزی", title:"جایی را بیازمای که الگو می‌شکند", body:"نمونه‌های نادر و ورودی‌های تازه می‌توانند فرض‌های پنهان را آشکار کنند.", narration:"از مسیر آسان فراتر برویم. حالت‌های مرزی و شرایط متغیر را امتحان کنیم و مستند کنیم سیستم چه کارهایی را نمی‌تواند با اطمینان انجام دهد.", bullets:["حالت مرزی","داده متغیر","محدودیت‌ها"] },
      { kicker:"جمع‌بندی", title:"هوش مصنوعی را با قضاوت به کار ببر", body:"سیستم مفید به توانایی، ارزیابی و مرزبندی روشن نیاز دارد.", narration:"یک سیستم فقط مدل آن نیست؛ داده، آزمون، محافظت و تصمیم انسانی هم نتیجه را شکل می‌دهند. این الگو مفهومی است، پس ادعاهای عملکرد واقعی باید به شواهد معتبر متصل شوند.", bullets:["توانایی","شواهد","مرزبندی"] }
    ],
    "solar-energy": [
      { kicker:"منبع", title:"مسیر نور خورشید تا برق را دنبال کن", body:"مسیر نور، تبدیل انرژی و رسیدن برق به مصرف‌کننده را دنبال کن.", narration:"برای توضیح برق خورشیدی، مسیر انرژی را از نور خورشید تا خروجی الکتریکی مفید دنبال می‌کنیم. هر تبدیل باید قابل مشاهده باشد و پنل را از بقیه اجزای سامانه جدا کنیم.", bullets:["نور خورشید","تبدیل","برق مفید"] },
      { kicker:"پنل", title:"نور به سلول‌ها می‌رسد", body:"سلول فتوولتائیک بخشی از نور ورودی را به انرژی الکتریکی تبدیل می‌کند.", narration:"پنل نخستین مرحله قابل مشاهده است. سلول‌ها بخشی از نور ورودی را به انرژی الکتریکی تبدیل می‌کنند؛ مقدار خروجی به شرایط واقعی بستگی دارد و برای یک نصب مشخص باید اندازه‌گیری شود.", bullets:["نور","سلول","خروجی"] },
      { kicker:"جریان برق", title:"برق شکل تازه‌ای پیدا می‌کند", body:"الکترونیک قدرت خروجی پنل را برای مرحله بعد آماده می‌کند.", narration:"خروجی الکتریکی را به سمت اینورتر و تجهیزات کنترل دنبال کنیم. این مرحله نحوه تحویل توان را تنظیم می‌کند؛ شکل اینجا شماتیک است و نقشه سیم‌کشی محسوب نمی‌شود.", bullets:["خروجی پنل","اینورتر","کنترل"] },
      { kicker:"سامانه", title:"پنل‌ها را به یک مکان وصل کن", body:"سازه، سیم‌کشی، اینورتر و مصرف‌کننده با هم یک سامانه می‌سازند.", narration:"یک پنل به‌تنهایی کل نصب نیست. سازه نصب، سیم‌کشی، اینورتر، حفاظت و بار الکتریکی همگی بر رفتار سامانه اثر می‌گذارند و باید به اندازه لازم توضیح داده شوند.", bullets:["سازه","سیم‌کشی","اینورتر"] },
      { kicker:"مصرف", title:"تولید را با زمان مصرف هماهنگ کن", body:"نیاز انرژی در طول زمان و در مکان‌های مختلف تغییر می‌کند.", narration:"تولید و مصرف همیشه هم‌زمان نیستند. نشان بده برق چه زمانی تولید می‌شود و چه زمانی لازم است؛ برای مقایسه واقعی تولید و تقاضا باید از داده محلی بررسی‌شده استفاده کرد.", bullets:["تولید","تقاضا","زمان"] },
      { kicker:"ذخیره‌سازی", title:"ذخیره‌سازی انرژی را به زمان دیگر می‌برد", body:"باتری می‌تواند انرژی را برای بعد نگه دارد و محدودیت‌های خودش را دارد.", narration:"ذخیره‌سازی یک مسیر زمانی دیگر به سامانه اضافه می‌کند. باتری، تلفات تبدیل، حدود کارکرد و کنترل ایمنی اهمیت دارند؛ نسخه مستند باید از مشخصات همان سامانه استفاده کند، نه وعده‌های عمومی.", bullets:["شارژ","ذخیره","تخلیه"] },
      { kicker:"موازنه", title:"بیشتر از خروجی را بسنج", body:"هزینه، شرایط محیطی، نگهداری و مقررات شبکه در نتیجه واقعی نقش دارند.", narration:"مقایسه مفید فقط نمی‌پرسد پنل چه مقدار توان می‌تواند تولید کند. شرایط نصب، نگهداری، هزینه، ذخیره‌سازی و مقررات شبکه هم بر تصمیم عملی اثر می‌گذارند.", bullets:["شرایط","هزینه","نگهداری"] },
      { kicker:"جمع‌بندی", title:"کل مسیر انرژی را ببین", body:"منبع، تبدیل، کنترل و مصرف را در کنار هم درک کن.", narration:"کل مسیر را دوباره کنار هم بگذاریم؛ از نور خورشید تا جایی که برق مصرف می‌شود. این الگو مفهومی است؛ نسخه مستند باید به استانداردهای فنی و داده‌های همان نصب ارجاع بدهد.", bullets:["منبع","تبدیل","مصرف"] }
    ]
  }
};

export function buildLocalPlan({topic,language="fa",styleId,totalFrames=2700,fps=30}){
  if(!String(topic||"").trim())throw new Error("A topic is required.");
  const locale=COPY[language]?language:"en";const c=COPY[locale];const family=detectTopicVisualFamily(topic);const topicRows=TOPIC_STORIES[locale]?.[family]||null;const order=LAYOUTS_BY_STYLE[styleId]||LAYOUTS_BY_STYLE["cinematic-documentary"];
  const draft=c.rows.map((r,i)=>{const custom=topicRows?.[i];return {id:"scene-"+String(i+1).padStart(2,"0"),kicker:custom?.kicker||r[0],title:i===0?String(topic).trim():custom?.title||r[1].replaceAll("{topic}",String(topic).trim()),body:custom?.body||r[2],narration:custom?.narration||r[3],layout:order[i],bullets:custom?.bullets||r[4],sourceRefs:[],transition:["wipe","scale","split","fade"][i%4]};});
  const frames=allocateFrames(draft,totalFrames,fps);return {title:String(topic).trim(),subtitle:c.subtitle,scenes:draft.map((s,i)=>({...s,durationInFrames:frames[i]})),contentMode:topicRows?"conceptual_topic_template":"conceptual_template",languageUsed:locale,languageFallback:locale===language?null:"Local fallback is available in English only for this language."};
}
export function validateStoryboard(p){
  const errors=[];if(!p||typeof p!=="object"||Array.isArray(p))return ["Storyboard must be an object."];if(!String(p.title||"").trim())errors.push("Title is required.");
  if(!Array.isArray(p.scenes)||p.scenes.length<4||p.scenes.length>16){errors.push("Storyboard must have 4-16 scenes.");return errors;}const ids=new Set();
  for(const s of p.scenes){if(!s||typeof s!=="object"){errors.push("Scene is invalid.");continue;}if(!String(s.id||"").trim())errors.push("Scene id is required.");if(ids.has(s.id))errors.push("Duplicate scene id: "+s.id);ids.add(s.id);for(const f of ["kicker","title","body","narration"])if(typeof s[f]!=="string")errors.push("Scene "+s.id+" field "+f+" must be text.");if(!LAYOUTS.has(s.layout))errors.push("Scene "+s.id+" layout is invalid.");if(s.bullets!==undefined&&(!Array.isArray(s.bullets)||s.bullets.length>4||s.bullets.some(v=>typeof v!=="string")))errors.push("Scene "+s.id+" bullets invalid.");}
  return errors;
}
export function normalizePlan(p,ctx){
  if(!p||typeof p!=="object")throw new Error("AI storyboard was not a JSON object.");const allowed=new Set((ctx.sources||[]).map(s=>s.url));const fallback=buildLocalPlan(ctx);
  const scenes=(Array.isArray(p.scenes)?p.scenes:[]).map((s,i)=>({id:String(s.id||"scene-"+String(i+1).padStart(2,"0")),kicker:String(s.kicker||"SECTION "+(i+1)).slice(0,140),title:String(s.title||"").trim().slice(0,260),body:String(s.body||"").trim().slice(0,1000),narration:String(s.narration||"").trim().slice(0,1400),layout:LAYOUTS.has(s.layout)?s.layout:fallback.scenes[i%8].layout,bullets:Array.isArray(s.bullets)?s.bullets.filter(v=>typeof v==="string").slice(0,4):[],sourceRefs:Array.isArray(s.sourceRefs)?s.sourceRefs.filter(u=>allowed.has(u)):[],transition:["wipe","fade","scale","split"].includes(s.transition)?s.transition:["wipe","scale","split","fade"][i%4]}));
  const out={title:String(p.title||ctx.topic).slice(0,260),subtitle:String(p.subtitle||fallback.subtitle).slice(0,260),scenes,contentMode:"ai_generated"};const errors=validateStoryboard(out);if(errors.length)throw new Error(errors.join(" "));const durations=allocateFrames(out.scenes,ctx.totalFrames,ctx.fps);out.scenes=out.scenes.map((s,i)=>({...s,durationInFrames:durations[i]}));return out;
}
async function readJson(p){return JSON.parse(await readFile(p,"utf8"));}
function normalizeSources(raw){
 const rows=Array.isArray(raw)?raw:Array.isArray(raw?.sources)?raw.sources:[];const seen=new Set();
 return rows.map(v=>typeof v==="string"?{url:v,title:v,description:"",markdown:""}:v&&typeof v==="object"?{url:String(v.url||v.sourceURL||""),title:String(v.title||""),description:String(v.description||v.summary||""),markdown:String(v.markdown||v.content||"")}:null)
 .filter(v=>{if(!v||!/^https?:\/\//i.test(v.url)||seen.has(v.url))return false;seen.add(v.url);return true;}).slice(0,10).map(v=>({...v,description:v.description.slice(0,1500),markdown:v.markdown.slice(0,4500)}));
}
async function searchFirecrawl(topic,language,env){
 const r=await fetch("https://api.firecrawl.dev/v2/search",{method:"POST",headers:{Authorization:"Bearer "+env.FIRECRAWL_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({query:topic+" reliable background explanation sources "+language,limit:6,sources:["web"],safe:true,highlights:true,timeout:45000,scrapeOptions:{formats:["markdown"]}}),signal:AbortSignal.timeout(60000)});const d=await r.json().catch(()=>({}));if(!r.ok||d.success===false)throw new Error("Firecrawl HTTP "+r.status);
 return normalizeSources((d.data?.web||[]).map(v=>({url:v.url,title:v.title,description:v.description||v.metadata?.description||"",markdown:v.markdown||""})));
}
function parseClaudeJson(d){
 const text=(d.content||[]).filter(v=>v.type==="text").map(v=>v.text).join("\n").trim();const start=text.indexOf("{"),end=text.lastIndexOf("}");if(start<0||end<=start)throw new Error("Claude did not return a JSON object.");return JSON.parse(text.slice(start,end+1));
}
async function generateClaude(ctx,research,env){
 const sourceInfo=research.sources.map((s,i)=>({id:i+1,title:s.title,url:s.url,description:s.description,excerpt:s.markdown.slice(0,1400)}));
 const system="You are a research-aware writer and senior motion-design art director. Return only JSON. Never invent statistics, dates, quotes, sources or scientific claims. Use only the supplied URLs in sourceRefs. If unsupported, omit a factual detail or mark uncertainty. Create original work; don't copy existing films.";
 const prompt=["Create a story-led motion-graphics plan.","Topic: "+ctx.topic,"Language: "+ctx.language,"Runtime: "+ctx.duration+" seconds; aspect ratio: "+ctx.aspectRatio,"Selected visual style: "+ctx.styleId+" ("+PRESETS[ctx.styleId].label+")","Return JSON fields title, subtitle, scenes.","Use 7 to 10 scenes, each with id,kicker,title,body,narration,layout,bullets,sourceRefs,transition.","Allowed layouts: "+Array.from(LAYOUTS).join(", "),"Allowed transitions: wipe, fade, scale, split.","Use varied visual layouts, concise screen text and natural narration. Exact type is composited by renderer.","The opening hero title must be a concise subject-led phrase of 2–6 words where possible. Do not repeat generic question wording such as What question sits behind when the kicker already frames the question; avoid an oversized opening sentence that simply repeats the topic.","Do not fabricate data. Any sourceRefs must exactly match an input URL.","Available source material: "+JSON.stringify(sourceInfo)].join("\n");
 const model=env.ANTHROPIC_MODEL||"claude-sonnet-5-5";const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","content-type":"application/json"},body:JSON.stringify({model,max_tokens:5200,temperature:0.6,system,messages:[{role:"user",content:prompt}]}),signal:AbortSignal.timeout(90000)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error("Claude API HTTP "+r.status+": "+String(d.error?.message||"unknown error").slice(0,300));return {plan:parseClaudeJson(d),model,usage:d.usage||null};
}
function dimensions(ratio){return ratio==="9:16"?{width:1080,height:1920}:ratio==="1:1"?{width:1080,height:1080}:{width:1920,height:1080};}
function sumFrames(scenes){return scenes.reduce((n,s)=>n+Math.max(1,Math.round(s.durationInFrames||0)),0);}
function executable(command){for(const d of (process.env.PATH||"").split(delimiter)){const p=join(d,command);try{if(spawnSync("test",["-x",p],{timeout:1500}).status===0)return p;}catch{}}return null;}
function run(command,args,timeout=120000){return new Promise(resolvePromise=>{let stdout="",stderr="",settled=false;let child;try{child=spawn(command,args,{stdio:["ignore","pipe","pipe"]});}catch(e){resolvePromise({code:null,error:String(e)});return;}const append=(a,b)=>(a+b.toString()).slice(-10000);child.stdout.on("data",d=>stdout=append(stdout,d));child.stderr.on("data",d=>stderr=append(stderr,d));let timedOut=false;const timer=setTimeout(()=>{timedOut=true;child.kill("SIGTERM");setTimeout(()=>{if(!settled)child.kill("SIGKILL");},3000).unref();},timeout);child.on("error",e=>{if(settled)return;settled=true;clearTimeout(timer);resolvePromise({code:null,stdout,stderr,error:String(e),timedOut});});child.on("close",code=>{if(settled)return;settled=true;clearTimeout(timer);resolvePromise({code,stdout,stderr,timedOut});});});}
export function wavDuration(b){if(!Buffer.isBuffer(b)||b.length<44||b.toString("ascii",0,4)!=="RIFF")return null;const byteRate=b.readUInt32LE(28);let dataSize=null;for(let i=12;i+8<=b.length;){const name=b.toString("ascii",i,i+4),n=b.readUInt32LE(i+4);if(name==="data"){dataSize=n;break;}i+=8+n+(n%2);}return byteRate&&dataSize!==null?dataSize/byteRate:null;}
async function makeVoice(scenes,language,mode,runId,fps,warnings){
 const result={status:"disabled",engine:null,generatedScenes:0,warnings:[]};
 if(mode==="off")return result;
 const locale=String(language).split("-")[0].toLowerCase();
 let engine=null;
 if(locale==="fa"){
  if(mode==="pocket-tts"){
   const w="Pocket TTS does not currently provide an official Persian voice. Choose auto or persian-speech; no unrelated voice was substituted.";
   result.status="unsupported_language";result.warnings.push(w);warnings.push(w);return result;
  }
  const speech=executable("speech");
  if(!speech){
   const w="Persian Speech (Mana-Persian-Piper) is not installed; output will have no Persian narration. Install persian-speech and rerun with --voice auto or --voice persian-speech.";
   result.status="not_installed";result.warnings.push(w);warnings.push(w);return result;
  }
  engine={name:"Persian Speech / Mana-Persian-Piper",executable:speech,args:(text,file)=>[text,file],timeout:240000};
 }else{
  if(mode==="persian-speech"){
   const w="persian-speech supports Persian text, not "+locale+". Use auto or pocket-tts for a supported language.";
   result.status="unsupported_language";result.warnings.push(w);warnings.push(w);return result;
  }
  const models={en:["english","alba"],de:["german","juergen"],fr:["french","estelle"],pt:["portuguese","rafael"],it:["italian","giovanni"],es:["spanish","lola"],nl:["dutch","alba"]};
  if(!models[locale]){
   const w="No configured local voice supports language '"+locale+"'. No unrelated-language voice was substituted.";
   result.status="unsupported_language";result.warnings.push(w);warnings.push(w);return result;
  }
  const pocket=executable("pocket-tts");
  if(!pocket){
   const w="Pocket TTS is not installed; output will have no generated narration. Install pocket-tts for the selected language.";
   result.status="not_installed";result.warnings.push(w);warnings.push(w);return result;
  }
  engine={name:"Pocket TTS",executable:pocket,args:(text,file)=>["generate","--text",text,"--output-path",file,"--language",models[locale][0],"--voice",models[locale][1],"--quiet"],timeout:180000};
 }
 result.engine=engine.name;result.status="generating";
 const dir=resolve("public","generated",runId);await mkdir(dir,{recursive:true});
 const narratedScenes=scenes.filter(s=>String(s.narration||"").trim());
 for(let i=0;i<scenes.length;i++){
  const s=scenes[i];if(!String(s.narration||"").trim())continue;
  const name="voice-"+String(i+1).padStart(2,"0")+".wav",file=join(dir,name);
  const r=await run(engine.executable,engine.args(s.narration,file),engine.timeout);
  if(r.code!==0){
   const w=engine.name+" failed on "+s.id+(r.timedOut?" (timeout).":": "+String(r.stderr||r.error||"unknown error").slice(-220));
   result.status="partial";result.warnings.push(w);warnings.push(w);continue;
  }
  let b;try{b=await readFile(file);}catch{}
  const seconds=wavDuration(b);
  if(!seconds||seconds<=0){
   const w=engine.name+" produced an unreadable or empty WAV for "+s.id;
   result.status="partial";result.warnings.push(w);warnings.push(w);continue;
  }
  s.audioSrc="generated/"+runId+"/"+name;
  s.audioDurationInFrames=Math.ceil(seconds*fps);
  s.durationInFrames=s.audioDurationInFrames+Math.ceil(fps*1.1);
  result.generatedScenes++;
 }
 if(result.generatedScenes===narratedScenes.length&&narratedScenes.length>0)result.status="generated";
 else if(result.generatedScenes>0)result.status="partial";
 else result.status="failed";
 return result;
}
export function createProceduralBedWav(seconds, styleId = "cinematic-documentary", transitionCues = []) {
 const duration = Math.max(5, Math.min(3600, Number(seconds) || 5));
 const rate = 24000;
 const count = Math.floor(duration * rate);
 const bytes = count * 4;
 const b = Buffer.alloc(44 + bytes);
 b.write("RIFF", 0); b.writeUInt32LE(36 + bytes, 4); b.write("WAVE", 8);
 b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
 b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34);
 b.write("data", 36); b.writeUInt32LE(bytes, 40);
 const tau = Math.PI * 2;
 const bpm = styleId === "editorial-kinetic-type" || styleId === "vertical-social" ? 106
  : styleId === "character-2d" ? 112
  : styleId === "maps-timeline" || styleId === "tactile-collage" ? 84
  : styleId === "data-journalism" ? 98 : 92;
 const beatSeconds = 60 / bpm;
 const cues = Array.from(transitionCues || []).map(cue => {
  const time = typeof cue === "number" ? cue : Number(cue?.time);
  const type = typeof cue === "number" ? "wipe" : String(cue?.type || "wipe").toLowerCase();
  return { time, type: ["wipe", "fade", "scale", "split"].includes(type) ? type : "wipe" };
 }).filter(cue => Number.isFinite(cue.time) && cue.time > 0.05 && cue.time < duration - 0.05)
   .sort((a, b) => a.time - b.time);
 const chords = [
  [45, 48, 52, 55], // A minor 7
  [41, 45, 48, 52], // F major 7
  [48, 52, 55, 59], // C major 7
  [43, 47, 50, 53]  // G dominant color
 ].map(notes => notes.map(note => 440 * Math.pow(2, (note - 69) / 12)));
 const toSample = value => Math.max(-0.92, Math.min(0.92, value));
 let cueIndex = 0;
 for (let i = 0; i < count; i++) {
  const t = i / rate;
  const fade = Math.max(0, Math.min(1, t / 2.8, (duration - t) / 3.2));
  const slowSwell = 0.78 + 0.12 * Math.sin(tau * 0.045 * t) + 0.07 * Math.sin(tau * 0.071 * t + 1.3);
  const barIndex = Math.floor(t / (beatSeconds * 4));
  const chord = chords[barIndex % chords.length];
  const beatPosition = t % beatSeconds;
  const halfBeat = beatSeconds / 2;
  const stepIndex = Math.floor(t / halfBeat);
  const stepPosition = t % halfBeat;
  const pluckFrequency = chord[(stepIndex + Math.floor(stepIndex / 8)) % chord.length] * 2;
  const pad =
   Math.sin(tau * chord[0] * t) * 0.12 +
   Math.sin(tau * chord[1] * t + 0.12) * 0.075 +
   Math.sin(tau * chord[2] * t + 0.31) * 0.065 +
   Math.sin(tau * chord[3] * t + 0.6) * 0.035 +
   Math.sin(tau * chord[2] * 1.003 * t) * 0.025;
  const sub = Math.sin(tau * chord[0] * 0.5 * t) * (0.11 + 0.03 * Math.sin(tau * 0.03 * t));
  const strongBeat = Math.floor(t / beatSeconds) % 4 === 0;
  const kickEnvelope = Math.exp(-beatPosition * 22);
  const kick = Math.sin(tau * (58 * beatPosition - 15 * beatPosition * beatPosition)) * kickEnvelope * (strongBeat ? 0.085 : 0.025);
  const pluck = Math.sin(tau * pluckFrequency * stepPosition) * Math.exp(-stepPosition * 7.5) * 0.048;
  const shimmer = Math.sin(tau * (pluckFrequency * 2) * stepPosition) * Math.exp(-stepPosition * 18) * 0.009;
  const accent = (stepIndex % 2 === 1 ? Math.sin(tau * 6400 * stepPosition) * Math.exp(-stepPosition * 55) * 0.009 : 0);
  const texture = Math.sin(tau * 173 * t + Math.sin(tau * 0.07 * t)) * 0.018;
  while (cueIndex < cues.length && t > cues[cueIndex].time + 0.24) cueIndex++;
  let transitionSfx = 0;
  const cue = cues[cueIndex];
  if (cue) {
   const relative = t - cue.time;
   if (relative >= -0.38 && relative < 0.24) {
    const progress = Math.max(0, Math.min(1, (relative + 0.38) / 0.62));
    const weight = cue.type === "fade" ? 0.42 : cue.type === "scale" ? 0.9 : cue.type === "split" ? 0.68 : 1;
    const sweepBase = cue.type === "split" ? 730 : cue.type === "scale" ? 180 : 390;
    const sweepRange = cue.type === "scale" ? 760 : cue.type === "split" ? 2200 : 1640;
    const sweep = Math.sin(tau * (sweepBase * progress + sweepRange * progress * progress))
      + 0.28 * Math.sin(tau * (sweepBase * 1.7 * progress + sweepRange * 0.72 * progress * progress) + 0.4);
    const swell = Math.pow(progress, 1.45) * Math.exp(-Math.max(0, relative) * 14);
    const impactHz = cue.type === "scale" ? 92 : cue.type === "split" ? 620 : 126;
    const impact = Math.sin(tau * impactHz * relative + 1.15) * Math.exp(-Math.abs(relative) * 28) * 0.038 * weight;
    transitionSfx = sweep * swell * 0.075 * weight + impact;
   }
  }
  const mono = (pad * 0.82 + sub + kick + pluck + shimmer + accent + texture + transitionSfx) * slowSwell * fade;
  const left = toSample(mono + Math.sin(tau * 0.17 * t) * 0.006 * fade);
  const right = toSample(mono * (0.96 + 0.025 * Math.sin(tau * 0.13 * t)) + Math.sin(tau * 0.19 * t + 0.5) * 0.006 * fade);
  b.writeInt16LE(Math.round(left * 32767), 44 + i * 4);
  b.writeInt16LE(Math.round(right * 32767), 46 + i * 4);
 }
 return b;
}
async function writeBed(path, seconds, styleId, transitionCues = []) {
 await writeFile(path, createProceduralBedWav(seconds, styleId, transitionCues));
}



function srtTime(sec){const m=Math.round(Math.max(0,sec)*1000);const h=Math.floor(m/3600000),mi=Math.floor(m%3600000/60000),s=Math.floor(m%60000/1000),ms=m%1000;return [h,mi,s].map(v=>String(v).padStart(2,"0")).join(":")+","+String(ms).padStart(3,"0");}
export function splitCaptionSegments(text,maxChars=44){
 const limit=Math.max(1,Math.floor(Number(maxChars)||44));
 const words=String(text||"").trim().split(/\s+/).filter(Boolean).flatMap(word=>{
  const chars=Array.from(word);
  if(chars.length<=limit)return [word];
  const chunks=[];
  for(let i=0;i<chars.length;i+=limit)chunks.push(chars.slice(i,i+limit).join(""));
  return chunks;
 });
 if(!words.length)return [];
 const lines=[];let line="";
 for(const word of words){
  const next=line?line+" "+word:word;
  if(line&&Array.from(next).length>limit){lines.push(line);line=word;}else line=next;
 }
 if(line)lines.push(line);
 const segments=[];
 for(let i=0;i<lines.length;i+=2)segments.push([lines[i],lines[i+1]].filter(Boolean).join("\n"));
 return segments;
}
function makeSrt(scenes,fps){
 let cursor=0,index=1;const rows=[];
 for(const s of scenes){
  const sceneFrames=s.durationInFrames;
  const spokenFrames=Math.min(sceneFrames,s.audioDurationInFrames||sceneFrames);
  const segments=splitCaptionSegments(s.narration);
  const wordCounts=segments.map(v=>v.split(/\s+/).filter(Boolean).length);
  const totalWords=wordCounts.reduce((a,b)=>a+b,0)||1;
  let offset=0;
  for(let i=0;i<segments.length;i++){
   const start=cursor+Math.round(spokenFrames*offset/totalWords);
   offset+=wordCounts[i];
   const end=cursor+(i===segments.length-1?spokenFrames:Math.round(spokenFrames*offset/totalWords));
   rows.push(index+++"\n"+srtTime(start/fps)+" --> "+srtTime(Math.max(start+1,end)/fps)+"\n"+segments[i]+"\n");
  }
  cursor+=sceneFrames;
 }
 return rows.join("\n");
}
function timedScenes(scenes,fps){let cursor=0;return scenes.map(s=>{const start=cursor,end=start+s.durationInFrames;cursor=end;return {...s,startFrame:start,endFrame:end,startSeconds:Number((start/fps).toFixed(3)),endSeconds:Number((end/fps).toFixed(3))};});}
export function validateVoiceGeneration(mode,voice){
 if(mode==="off")return [];
 if(!voice||voice.status!=="generated"){
  const status=String(voice?.status||"missing");
  const generated=Number.isInteger(voice?.generatedScenes)?voice.generatedScenes:0;
  return ["Narration was requested but was not fully generated (status: "+status+"; generated scenes: "+generated+"). Refusing to deliver a silent or partially narrated video. Fix the voice engine or explicitly set --voice off for music-only output."];
 }
 return [];
}

export function parsePeakVolumeDb(logText){
 const match=String(logText||"").match(/max_volume:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*dB/i);
 if(!match)return null;
 const value=match[1].toLowerCase();
 if(value==="inf")return Infinity;
 if(value==="-inf")return -Infinity;
 const parsed=Number(value);
 return Number.isFinite(parsed)?parsed:null;
}
export function sampleTimes(durationSeconds){
 const duration=Number(durationSeconds);
 if(!Number.isFinite(duration)||duration<=0)return [];
 const clampTime=value=>Math.max(0,Math.min(Math.max(0,duration-0.1),value));
 const candidates=[duration*0.08,duration*0.58,duration*0.96];
 return Array.from(new Set(candidates.map(value => Number(clampTime(value).toFixed(2)))));
}

async function checkVideo(file,expected,dir){
 const report={fileExists:"NOT_RUN",nonEmpty:"NOT_RUN",probe:"NOT_RUN",decode:"NOT_RUN",frameSamples:"NOT_RUN",audioSignal:"NOT_RUN",audioPeakDb:null,creativeReview:"NOT_RUN",audioListening:"NOT_RUN",failures:[],metadata:null,sampledFrames:[]};let st;try{st=await stat(file);report.fileExists="PASS";report.nonEmpty=st.size?"PASS":"FAIL";report.fileSizeBytes=st.size;}catch{report.fileExists="FAIL";report.nonEmpty="FAIL";report.failures.push("Video file missing.");return report;}
 const probe=executable("ffprobe"),ffmpeg=executable("ffmpeg");if(!probe){report.probe="BLOCKED";report.failures.push("ffprobe is unavailable.");return report;}
 const p=await run(probe,["-v","error","-show_streams","-show_format","-of","json",file],45000);if(p.code!==0){report.probe="FAIL";report.failures.push("ffprobe could not read output.");return report;}let d;try{d=JSON.parse(p.stdout);}catch{report.probe="FAIL";report.failures.push("Invalid ffprobe JSON.");return report;}
 const v=(d.streams||[]).find(s=>s.codec_type==="video"),a=(d.streams||[]).filter(s=>s.codec_type==="audio"),duration=Number(d.format?.duration||0),rate=String(v?.avg_frame_rate||v?.r_frame_rate||"0/1").split("/"),fps=rate.length===2?Number(rate[0])/Number(rate[1]):Number(rate[0]);
 report.metadata={codec:v?.codec_name||null,width:v?.width||null,height:v?.height||null,frameRate:v?.avg_frame_rate||v?.r_frame_rate||null,durationSeconds:duration,audioStreams:a.length,audioCodecs:a.map(x=>x.codec_name)};
 const ok=v?.codec_name==="h264"&&v.width===expected.width&&v.height===expected.height&&Math.abs(fps-expected.fps)<0.02&&duration>=expected.durationSeconds*0.9&&a.length>=(expected.audioExpected?1:0);report.probe=ok?"PASS":"FAIL";if(!ok)report.failures.push("MP4 metadata differs from expected properties.");
 if(ffmpeg){const dec=await run(ffmpeg,["-v","error","-i",file,"-f","null","-"],Math.max(120000,expected.durationSeconds*3000));report.decode=dec.code===0?"PASS":"FAIL";if(dec.code!==0)report.failures.push("Full-file decode failed.");const frameDir=join(dir,"frame-samples");await mkdir(frameDir,{recursive:true});let all=true;const times=sampleTimes(duration);for(let i=0;i<times.length;i++){const frame=join(frameDir,"frame-"+String(i+1).padStart(2,"0")+".jpg");const r=await run(ffmpeg,["-y","-v","error","-ss",times[i].toFixed(2),"-i",file,"-frames:v","1","-q:v","3",frame],30000);if(r.code===0)report.sampledFrames.push({path:frame,second:Number(times[i].toFixed(2))});else all=false;}report.frameSamples=all&&report.sampledFrames.length?"PASS_EXTRACTED_NOT_VISUALLY_REVIEWED":"FAIL";}else{report.decode="BLOCKED";report.frameSamples="BLOCKED";report.failures.push("ffmpeg is unavailable.");}
 if(a.length&&ffmpeg){
  const measured=await run(ffmpeg,["-hide_banner","-i",file,"-vn","-af","volumedetect","-f","null","-"],Math.max(60000,expected.durationSeconds*2500));
  const peak=parsePeakVolumeDb(measured.stderr);
  report.audioPeakDb=peak===null?null:Number.isFinite(peak)?Number(peak.toFixed(2)):peak===-Infinity?"-inf":"inf";
  report.audioSignal=measured.code===0&&peak!==null&&Number.isFinite(peak)&&peak>-60?"PASS":"FAIL";
  if(report.audioSignal==="FAIL")report.failures.push("Audio stream is silent or its peak signal could not be verified above -60 dBFS.");
 }else if(expected.audioExpected){
  report.audioSignal=ffmpeg?"FAIL":"BLOCKED";
  report.failures.push(ffmpeg?"Expected audio stream is missing.":"ffmpeg is unavailable for audio signal verification.");
 }else report.audioSignal="NOT_EXPECTED";
 report.durationSeconds=duration;return report;
}

export const HELP_TEXT="Motion Graphics Studio production CLI\n\nRequired: --topic \"Your topic\"\nOptions: --language fa|en, --duration 5..3600, --style auto|editorial|data|science|documentary|collage|product3d|character2d|swiss|generative|timeline|vertical|hybrid, --aspect-ratio 16:9|9:16|1:1, --brief JSON, --sources JSON, --voice auto|off|pocket-tts|persian-speech, --allow-paid-ai, --plan-only, --no-research, --output-dir out\n\nPaid provider APIs are never called unless --allow-paid-ai or MOTION_STUDIO_ALLOW_PAID_API=true is set.";

export async function produce(options,env=process.env){
 const warnings=[],runId=new Date().toISOString().replace(/[:.]/g,"-")+"-"+process.pid;let brief={};if(options.briefPath)brief=await readJson(resolve(options.briefPath));let sources=normalizeSources(brief.sources||brief.sourceUrls||[]);if(options.sourcesPath)sources=normalizeSources(sources.concat(normalizeSources(await readJson(resolve(options.sourcesPath)))));
 const topic=String(brief.topic||options.topic||"").trim();if(!topic)throw new Error("No topic supplied. Use --topic or --brief.");const language=String(brief.language||options.language||"fa").toLowerCase().split("-")[0],duration=Number(brief.durationSeconds||brief.duration||options.duration||90),ratio=String(brief.aspectRatio||options.aspectRatio||"16:9");if(!SUPPORTED_LANGUAGES.has(language))throw new Error("Unsupported language: "+language+". Supported languages: "+Array.from(SUPPORTED_LANGUAGES).join(", ")+".");if(duration<5||duration>3600||!Number.isFinite(duration))throw new Error("Duration must be 5-3600 seconds (one hour).");if(!["16:9","9:16","1:1"].includes(ratio))throw new Error("Invalid aspect ratio.");
 const fps=30,targetFrames=Math.round(duration*fps),styleId=chooseStyle(brief.style||options.style,topic,ratio),preset=PRESETS[styleId],size=dimensions(ratio),dir=resolve(options.outputDir||"out",runId);await mkdir(dir,{recursive:true});
 const briefRecord={topic,language,targetDurationSeconds:duration,targetFrames,aspectRatio:ratio,width:size.width,height:size.height,fps,requestedStyle:brief.style||options.style,selectedStyle:styleId,selectedStyleLabel:preset.label,paidAPIsOptedIn:options.allowPaidAI,voiceMode:options.voice,createdAt:new Date().toISOString(),assumptions:["Unspecified noncritical choices use defaults.","Local fallback is a conceptual template, not a researched factual script."]};await writeFile(join(dir,"brief.json"),JSON.stringify(briefRecord,null,2)+"\n");
 let research={status:sources.length?"user_sources_not_verified":"not_performed",method:sources.length?"user-provided sources":"none",capturedAt:new Date().toISOString(),sources,warning:sources.length?"Source list captured; factual claims not independently verified.":"No research sources were supplied or retrieved."};
 if(options.allowPaidAI&&!options.skipResearch&&env.FIRECRAWL_API_KEY){try{const found=await searchFirecrawl(topic,language,env);sources=normalizeSources(sources.concat(found));research={status:found.length?"retrieved_not_independently_fact_checked":"no_results",method:"Firecrawl web search",capturedAt:new Date().toISOString(),sources,warning:"Search results are candidates; do not assume each result supports a claim."};}catch(e){const w="Firecrawl search failed: "+String(e).slice(0,250);warnings.push(w);research.status="failed";research.warning=w;}}
 else if(options.allowPaidAI&&!options.skipResearch&&!env.FIRECRAWL_API_KEY)research.warning="FIRECRAWL_API_KEY absent; web research skipped.";
 else if(options.skipResearch)research.warning="Research skipped by request.";
 await writeFile(join(dir,"research.json"),JSON.stringify(research,null,2)+"\n");
 const ctx={topic,language,duration,aspectRatio:ratio,styleId,fps,totalFrames:targetFrames,sources};let plan=null,ai={status:"not_used",model:null,usage:null};
 if(options.allowPaidAI&&env.ANTHROPIC_API_KEY){try{const r=await generateClaude(ctx,research,env);plan=normalizePlan(r.plan,ctx);ai={status:"generated",model:r.model,usage:r.usage};}catch(e){warnings.push("Claude generation failed; local fallback used: "+String(e).slice(0,350));ai={status:"failed_fallback_used",model:env.ANTHROPIC_MODEL||"claude-sonnet-5-5"};}}
 else if(options.allowPaidAI){warnings.push("Paid AI was allowed but ANTHROPIC_API_KEY is not configured.");ai.status="key_missing_fallback_used";}
 if(!plan)plan=buildLocalPlan({topic,language,styleId,totalFrames:targetFrames,fps});let errors=validateStoryboard(plan);if(errors.length){warnings.push("Invalid storyboard; local fallback used: "+errors.join(" "));plan=buildLocalPlan({topic,language,styleId,totalFrames:targetFrames,fps});}
 const urls=new Set(sources.map(s=>s.url));plan.scenes=plan.scenes.map(s=>({...s,sourceRefs:(s.sourceRefs||[]).filter(u=>urls.has(u))}));if(plan.contentMode==="conceptual_template")warnings.push("Conceptual output only; factual claims have not been researched. Provide sources or explicitly opt into configured research/AI services for topic-specific scripts.");
 await writeFile(join(dir,"storyboard.json"),JSON.stringify({title:plan.title,subtitle:plan.subtitle,styleId,language,contentMode:plan.contentMode,researchStatus:research.status,scenes:plan.scenes},null,2)+"\n");
 let voice={status:"not_attempted",engine:null,generatedScenes:0,warnings:[]};if(options.planOnly)voice.status="not_run_plan_only";else voice=await makeVoice(plan.scenes,language,options.voice,runId,fps,warnings);
 const voiceErrors=options.planOnly?[]:validateVoiceGeneration(options.voice,voice);
 if(voiceErrors.length){
  warnings.push(...voiceErrors);
  const voiceQc={runId,status:"VOICE_GENERATION_FAILED",gates:{brief:"PASS",styleSelection:"PASS",storyboardValidation:errors.length?"FAIL":"PASS",voiceGeneration:"FAIL",render:"BLOCKED",mediaProbe:"NOT_RUN",fullDecode:"NOT_RUN",audioSignal:"NOT_RUN",frameSamples:"NOT_RUN",creativeReview:"NOT_RUN",audioListening:"NOT_RUN"},voice,warnings,facts:{factualClaimsAutomaticallyVerified:false,fontFilesVerified:false,visualFramesReviewedByHuman:false,audioListenedToByHuman:false,sourceCount:sources.length}};
  await writeFile(join(dir,"voice-status.json"),JSON.stringify(voice,null,2)+"\n");
  await writeFile(join(dir,"qc-report.json"),JSON.stringify(voiceQc,null,2)+"\n");
  throw new Error(voiceErrors.join(" "));
 }
 const hasVoice=plan.scenes.some(s=>s.audioSrc);if(!hasVoice){const frames=allocateFrames(plan.scenes,targetFrames,fps);plan.scenes=plan.scenes.map((s,i)=>({...s,durationInFrames:frames[i]}));}
 const totalFrames=sumFrames(plan.scenes),actualDuration=totalFrames/fps;let audioBedSrc;if(!options.planOnly){const assets=resolve("public","generated",runId);await mkdir(assets,{recursive:true});const transitionCues=[];let cueFrames=0;for(let i=0;i<plan.scenes.length;i++){if(i>0)transitionCues.push({time:cueFrames/fps,type:plan.scenes[i].transition||"wipe"});cueFrames+=plan.scenes[i].durationInFrames;}await writeBed(join(assets,"procedural-ambient-bed.wav"),actualDuration,styleId,transitionCues);audioBedSrc="generated/"+runId+"/procedural-ambient-bed.wav";}
 const visualFamily=detectTopicVisualFamily(topic);const props={topic,title:plan.title,subtitle:plan.subtitle||"",language,styleId,visualFamily,fps,width:size.width,height:size.height,durationInFrames:totalFrames,palette:preset.palette,typography:preset.typography,captionsEnabled:hasVoice,scenes:plan.scenes,...(audioBedSrc?{audioBedSrc}:{})};
 await writeFile(join(dir,"props.json"),JSON.stringify(props,null,2)+"\n");await writeFile(join(dir,"voiceover.txt"),plan.scenes.map(s=>s.narration||"").filter(Boolean).join("\n\n")+"\n");await writeFile(join(dir,"captions.srt"),makeSrt(plan.scenes,fps));await writeFile(join(dir,"storyboard-timed.json"),JSON.stringify({title:plan.title,subtitle:plan.subtitle,styleId,visualFamily,language,fps,width:size.width,height:size.height,durationInFrames:totalFrames,durationSeconds:actualDuration,scenes:timedScenes(plan.scenes,fps)},null,2)+"\n");
 const manifest={runId,createdAt:new Date().toISOString(),brief:briefRecord,selectedStyle:{id:styleId,label:preset.label,palette:preset.palette,typography:preset.typography},visualFamily,contentMode:plan.contentMode,research,ai,voice,audioBed:options.planOnly?"not_generated":"locally_synthesized_procedural_score_with_scene_synced_transition_sound_design",render:{status:options.planOnly?"NOT_RUN":"PENDING",composition:"MotionVideo"},output:{runDirectory:dir,videoPath:null},warnings};await writeFile(join(dir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
 const qcPath=join(dir,"qc-report.json"),qc={runId,status:options.planOnly?"PLAN_ONLY":"PENDING",gates:{brief:"PASS",styleSelection:"PASS",storyboardValidation:errors.length?"FAIL":"PASS",sourceResearch:research.status,fontAvailability:"NOT_RUN",rtlVisualReview:"NOT_RUN",voiceGeneration:voice.status,render:options.planOnly?"NOT_RUN":"PENDING",mediaProbe:"NOT_RUN",fullDecode:"NOT_RUN",audioSignal:"NOT_RUN",frameSamples:"NOT_RUN",creativeReview:"NOT_RUN",audioListening:"NOT_RUN"},facts:{factualClaimsAutomaticallyVerified:false,fontFilesVerified:false,visualFramesReviewedByHuman:false,audioListenedToByHuman:false,sourceCount:sources.length},warnings,files:{storyboard:"storyboard.json",timedStoryboard:"storyboard-timed.json",props:"props.json",narration:"voiceover.txt",captions:"captions.srt",manifest:"manifest.json"}};
 if(options.planOnly){await writeFile(qcPath,JSON.stringify(qc,null,2)+"\n");console.log("Plan created: "+dir);return {runId,runDir:dir,plan,props,qc,manifest};}
 const video=join(dir,"video.mp4");console.log("Rendering "+plan.scenes.length+" scenes ("+size.width+"x"+size.height+", "+fps+" fps).");const r=await run(process.platform==="win32"?"npx.cmd":"npx",["remotion","render","src/index.ts","MotionVideo",video,"--props",join(dir,"props.json"),"--codec=h264","--overwrite"],Math.max(300000,actualDuration*9000));
 manifest.render={status:r.code===0?"PASS":"FAIL",exitCode:r.code,timedOut:Boolean(r.timedOut),stderr:String(r.stderr||r.error||"").slice(-1800),composition:"MotionVideo"};manifest.output.videoPath=video;qc.gates.render=manifest.render.status;
 if(r.code!==0){qc.status="FAIL";qc.warnings=warnings.concat(["Remotion render failed."]);await writeFile(qcPath,JSON.stringify(qc,null,2)+"\n");manifest.warnings=qc.warnings;await writeFile(join(dir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");throw new Error("Remotion render failed; inspect workflow logs and "+qcPath);}
 const media=await checkVideo(video,{width:size.width,height:size.height,fps,durationSeconds:actualDuration,audioExpected:Boolean(audioBedSrc||hasVoice)},dir);qc.gates.mediaProbe=media.probe;qc.gates.fullDecode=media.decode;qc.gates.audioSignal=media.audioSignal;qc.gates.frameSamples=media.frameSamples;qc.media=media;qc.warnings=warnings;const passed=media.fileExists==="PASS"&&media.nonEmpty==="PASS"&&media.probe==="PASS"&&media.decode==="PASS"&&media.audioSignal==="PASS";qc.status=passed?"TECHNICAL_PASS_CREATIVE_REVIEW_PENDING":"TECHNICAL_QC_FAILED_OR_BLOCKED";manifest.render.status=passed?"TECHNICAL_PASS":"TECHNICAL_QC_FAILED_OR_BLOCKED";manifest.output={runDirectory:dir,videoPath:video,expectedDurationSeconds:actualDuration,mediaMetadata:media.metadata};manifest.warnings=warnings;
 await writeFile(qcPath,JSON.stringify(qc,null,2)+"\n");await writeFile(join(dir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");console.log("Video: "+video);console.log("Technical QC: "+qc.status+" (visual/audio review remains NOT_RUN).");if(!passed)throw new Error("Technical QC failed or blocked; see "+qcPath);return {runId,runDir:dir,plan,props,qc,manifest};
}
async function main(){try{const o=parseArgs();if(o.help){console.log(HELP_TEXT);return;}const r=await produce(o);console.log("Manifest: "+join(r.runDir,"manifest.json"));}catch(e){console.error("Motion Graphics Studio: "+String(e?.message||e));process.exitCode=1;}}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await main();
