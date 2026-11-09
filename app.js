// 1) Pon aquí la URL de tu Worker de Cloudflare (ver README). Si no la cambias, la web funciona en MODO DEMO.
const API_URL="fitverde.luiisso77.workers.dev";
const DEMO=API_URL.includes("fitverde");
const $=id=>document.getElementById(id);
const e=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const S=JSON.parse(localStorage.getItem("prog")||"{}");
const guardar=()=>localStorage.setItem("prog",JSON.stringify(S));
const img64=f=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,1024/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",.8).split(",")[1])};i.src=URL.createObjectURL(f)});
const pdf64=f=>new Promise(r=>{const d=new FileReader();d.onload=()=>r(d.result.split(",")[1]);d.readAsDataURL(f)});
// Para poner una foto real en una receta: sube el .jpg al repositorio y escribe su nombre en f (ej: f:"tortilla.jpg")
const R=[
{n:"Yogur griego con frutos rojos y avena",i:"🥣",k:300,o:["perder","mantener"],t:["lácteos","fruta"],g:["200 g de yogur griego natural","80 g de frutos rojos","30 g de copos de avena","1 cdta de miel (opcional)"],p:"Mezcla todo en un bol y listo.",f:""},
{n:"Tortilla de espinacas",i:"🍳",k:320,o:["perder","mantener"],t:["huevo","verdura"],g:["2 huevos","1 puñado de espinacas","1 tostada integral","1 cdta de aceite de oliva","Sal"],p:"Saltea las espinacas, añade los huevos batidos y cuaja la tortilla. Sirve con la tostada.",f:""},
{n:"Pollo a la plancha con verduras y arroz integral",i:"🍗",k:450,o:["perder","mantener","ganar"],t:["pollo","arroz","verdura"],g:["150 g de pechuga de pollo","60 g de arroz integral (en seco)","1 calabacín","1 pimiento","1 cda de aceite de oliva","Sal y especias"],p:"Cuece el arroz. Dora el pollo a la plancha y asa o saltea las verduras. Sirve junto.",f:""},
{n:"Ensalada de legumbres con atún",i:"🥗",k:420,o:["perder","mantener"],t:["legumbres","pescado","verdura"],g:["150 g de garbanzos cocidos","1 lata de atún al natural","1 tomate","1/2 cebolla","1 cda de aceite de oliva","Limón y sal"],p:"Escurre y mezcla todo en un bol. Aliña con aceite, limón y sal.",f:""},
{n:"Merluza al horno con calabacín",i:"🐟",k:350,o:["perder"],t:["pescado","verdura"],g:["200 g de merluza","1 calabacín","1 patata mediana","1 diente de ajo","1 cdta de aceite de oliva","Perejil y limón"],p:"Hornea la patata y el calabacín en rodajas 20 min a 200 °C, añade la merluza con ajo y perejil 12 min más.",f:""},
{n:"Lentejas con verduras",i:"🍲",k:500,o:["perder","mantener"],t:["legumbres","verdura"],g:["80 g de lentejas (en seco)","1 zanahoria","1 puerro","1 tomate","1 diente de ajo","1 cda de aceite de oliva","Pimentón y sal"],p:"Cuece las lentejas con las verduras troceadas y el sofrito 30-40 min.",f:""},
{n:"Avena con plátano y crema de cacahuete",i:"🍌",k:600,o:["ganar"],t:["fruta","frutos secos","lácteos"],g:["70 g de copos de avena","300 ml de leche","1 plátano","1 cda de crema de cacahuete","1 puñado de nueces"],p:"Cuece la avena con la leche 5 min y añade el plátano, la crema y las nueces.",f:""},
{n:"Arroz con ternera y verduras",i:"🥩",k:750,o:["ganar"],t:["carne","arroz","verdura"],g:["180 g de ternera","100 g de arroz (en seco)","1 pimiento","1 zanahoria","1 cda de aceite de oliva","Sal y especias"],p:"Saltea la ternera y las verduras, mézclalas con el arroz cocido.",f:""},
{n:"Salmón con boniato y brócoli",i:"🍣",k:650,o:["ganar","mantener"],t:["pescado","verdura"],g:["180 g de salmón","1 boniato mediano","200 g de brócoli","1 cda de aceite de oliva","Limón, sal y pimienta"],p:"Hornea el boniato 30 min a 200 °C, añade el salmón y el brócoli los últimos 15 min.",f:""},
{n:"Pasta integral con atún y tomate",i:"🍝",k:700,o:["ganar"],t:["pasta","pescado"],g:["100 g de pasta integral (en seco)","2 latas de atún","200 g de tomate triturado","1 diente de ajo","1 cda de aceite de oliva","30 g de queso rallado"],p:"Cuece la pasta, prepara la salsa con ajo, tomate y atún, y mezcla con queso.",f:""},
{n:"Batido de leche, plátano y frutos secos",i:"🥤",k:400,o:["ganar"],t:["lácteos","fruta","frutos secos"],g:["300 ml de leche","1 plátano","1 puñado de almendras","1 cda de avena"],p:"Tritura todo hasta que quede cremoso.",f:""},
{n:"Tofu salteado con verduras y arroz",i:"🥢",k:480,o:["perder","mantener","ganar"],t:["verdura","arroz"],g:["150 g de tofu firme","60 g de arroz (en seco)","1 pimiento","1 zanahoria","1 cda de salsa de soja","1 cda de aceite de oliva"],p:"Dora el tofu en dados, añade las verduras y la soja, y sirve con el arroz cocido.",f:""},
{n:"Hummus con crudités y pan integral",i:"🥕",k:350,o:["perder","mantener"],t:["legumbres","verdura"],g:["80 g de hummus","1 zanahoria","1 pepino","1 rebanada de pan integral"],p:"Corta las verduras en bastones y mójalas en el hummus.",f:""},
{n:"Pasta integral con garbanzos y espinacas",i:"🍝",k:680,o:["ganar"],t:["pasta","legumbres","verdura"],g:["100 g de pasta integral (en seco)","150 g de garbanzos cocidos","1 puñado de espinacas","1 diente de ajo","1 cda de aceite de oliva"],p:"Cuece la pasta y saltea el ajo con garbanzos y espinacas. Mezcla.",f:""},
{n:"Crema de calabaza y zanahoria",i:"🎃",k:250,o:["perder","mantener"],t:["verdura"],g:["300 g de calabaza","2 zanahorias","1 cebolla","1 cdta de aceite de oliva","Sal y pimienta"],p:"Cuece las verduras 20 min y tritúralas con un poco del caldo.",f:""},
{n:"Bowl de quinoa, aguacate y garbanzos",i:"🥑",k:600,o:["ganar","mantener"],t:["legumbres","verdura","fruta"],g:["70 g de quinoa (en seco)","150 g de garbanzos cocidos","1/2 aguacate","1 tomate","Limón y sal"],p:"Cuece la quinoa, mézclala con el resto y aliña con limón.",f:""}
];
const EJ={
Pecho:[["Press de banca","4×8-10","Baja la barra al pecho con control, sin rebotar."],["Flexiones","3×10-15","Cuerpo recto de cabeza a talones."],["Aperturas con mancuernas","3×12","Codos ligeramente flexionados."]],
Espalda:[["Jalón al pecho","4×10","Tira con los codos, no con las manos."],["Remo con mancuerna","4×8-10","Espalda recta, aprieta los omóplatos."],["Dominadas asistidas","3×6-8","Baja lento."]],
Piernas:[["Sentadilla","4×8-10","Rodillas alineadas con los pies, espalda neutra."],["Peso muerto rumano","3×10","Cadera atrás, barra pegada a las piernas."],["Zancadas","3×12 por pierna","Paso largo y torso erguido."],["Prensa","3×12","No bloquees las rodillas."]],
Hombros:[["Press militar","4×8-10","Abdomen firme, sin arquear la espalda."],["Elevaciones laterales","3×12-15","Sube hasta la altura del hombro."]],
Brazos:[["Curl de bíceps","3×10-12","Codos pegados al cuerpo."],["Extensión de tríceps","3×10-12","Movimiento controlado."]],
Core:[["Plancha","3×30-45 s","Cuerpo recto, glúteos apretados."],["Elevación de piernas","3×12","Sin balancear."],["Crunch","3×15","Sube con el abdomen, no tirando del cuello."]],
Cardio:[["Caminar rápido o cinta inclinada","30-45 min","Ritmo en el que aún puedes hablar."],["Bicicleta","20-30 min","Resistencia moderada."],["Intervalos (1 min rápido, 2 suave)","15-20 min","Solo si tienes buena base."]]};
const MOT=["Hoy es un gran día para cuidarte. ¡Un paso pequeño cuenta!","No tiene que ser perfecto, tiene que ser constante. 💪","Tu yo del futuro te dará las gracias por lo que hagas hoy.","Cada comida saludable y cada entrenamiento suman. ¡Tú puedes!","El progreso es lento pero seguro. Confía en el proceso."];
const GUSTOS=["pollo","pescado","huevo","carne","legumbres","arroz","pasta","verdura","fruta","lácteos","frutos secos"];
const RUT={perder:["Lun: fuerza tren superior","Mar: cardio 30-40 min","Mié: fuerza piernas y core","Jue: paseo o descanso","Vie: fuerza cuerpo completo","Sáb: cardio 30-40 min","Dom: descanso"],
ganar:["Lun: pecho y tríceps","Mar: espalda y bíceps","Mié: descanso","Jue: piernas","Vie: hombros y core","Sáb: cuerpo completo ligero","Dom: descanso"],
mantener:["Lun: fuerza tren superior","Mar: descanso","Mié: fuerza tren inferior","Jue: descanso","Vie: cuerpo completo","Sáb: cardio 30 min","Dom: descanso"]};
const MSG=["📸 Quien fotografía sus comidas es más constante. ¡Haz hoy tu primera foto!","⚡ Solo 5 segundos: haz la foto y nosotros hacemos las cuentas.","🎯 Lo que se mide, se mejora. Cada foto te acerca a tu objetivo."];
$("motiv").textContent=MSG[Math.floor(Math.random()*MSG.length)];
if(DEMO)$("demo").classList.remove("hidden");
const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),2500)};
const hoy=()=>new Date().toISOString().slice(0,10);
S.diario=S.diario||{};S.peso=S.peso||[];S.gustos=S.gustos||[];

// Bienvenida
if(!sessionStorage.getItem("bienvenida")){$("modalTxt").textContent=MOT[Math.floor(Math.random()*MOT.length)];$("modal").classList.remove("hidden")}
$("modalBtn").onclick=()=>{$("modal").classList.add("hidden");sessionStorage.setItem("bienvenida","1")};

// Pestañas
$("nav").onclick=ev=>{const b=ev.target.closest("button");if(!b)return;
  document.querySelectorAll(".pg").forEach(p=>p.classList.toggle("on",p.id==="pg-"+b.dataset.t));
  document.querySelectorAll("#nav button").forEach(x=>x.classList.toggle("on",x===b));scrollTo(0,0)};

// Perfil
["sexo","edad","peso","altura","actividad","objetivo"].forEach(id=>{if(S.perfil&&S.perfil[id])$(id).value=S.perfil[id]});
$("btnCalc").onclick=()=>{
  const lim={edad:[14,100],peso:[30,300],altura:[120,230]};let ok=true;
  for(const id in lim){const v=+$(id).value,bad=!v||v<lim[id][0]||v>lim[id][1];$(id).classList.toggle("bad",bad);if(bad)ok=false}
  if(!ok)return toast("Revisa edad (14-100), peso (30-300) y altura (120-230)");
  const h=$("sexo").value==="h",ed=+$("edad").value,p=+$("peso").value,a=+$("altura").value,obj=$("objetivo").value;
  const mant=(10*p+6.25*a-5*ed+(h?5:-161))*$("actividad").value;
  let k=obj==="perder"?.8:obj==="ganar"?1.15:1,nota="";if(ed<18){k=1;nota="Eres menor de 18: no se aplica déficit ni superávit. Consulta con un médico."}
  let kc=Math.round(mant*k);const min=h?1500:1200;
  if(obj==="perder"&&kc<min&&ed>=18){kc=min;nota="Ajustado al mínimo de seguridad ("+min+" kcal)."}
  S.kcalDia=kc;const pr=Math.round(p*(obj==="ganar"?2:1.8)),gr=Math.round(kc*.25/9),ch=Math.max(Math.round((kc-pr*4-gr*9)/4),0);
  $("kcal").textContent=kc+" kcal";$("detalle").textContent="Mantenimiento: "+Math.round(mant)+" kcal ("+(obj==="perder"?"déficit 20%":obj==="ganar"?"superávit 15%":"sin ajuste")+").";$("nota").textContent=nota;
  [["P",pr,pr*4],["C",ch,ch*4],["G",gr,gr*9]].forEach(([l,g,c])=>{$("m"+l).textContent=g+" g";$("b"+l).style.width=Math.min(c/kc*100*1.6,100)+"%"});
  $("resultados").classList.remove("hidden");
  S.perfil={sexo:$("sexo").value,edad:ed,peso:p,altura:a,actividad:$("actividad").value,objetivo:obj};guardar();recetas();ejercicios(grupo);diario();toast("Plan calculado ✅");
};

// Recetas
$("gustos").innerHTML=GUSTOS.map(x=>`<label class="chip"><input type="checkbox" value="${x}" ${S.gustos.includes(x)?"checked":""}> ${x}</label>`).join("");
$("dieta").value=S.dieta||"";
$("gustos").onchange=()=>{S.gustos=[...document.querySelectorAll("#gustos input:checked")].map(i=>i.value);guardar();recetas()};
$("dieta").onchange=()=>{S.dieta=$("dieta").value;guardar();recetas()};
$("objetivo").addEventListener("change",()=>{recetas();ejercicios(grupo)});
function recetas(){
  const ob=$("objetivo").value,g=S.gustos,d=S.dieta||"";
  const noV=["pollo","pescado","carne"],noVg=[...noV,"huevo","lácteos"],ex=d==="vegana"?noVg:d==="vegetariana"?noV:[];
  const l=R.filter(r=>r.o.includes(ob)&&!r.t.some(t=>ex.includes(t))).map(r=>({r,m:r.t.filter(t=>g.includes(t)).length})).filter(x=>!g.length||x.m).sort((a,b)=>b.m-a.m);
  $("recetas").innerHTML=l.length?l.map(x=>`<button class="rec" data-i="${R.indexOf(x.r)}"><div class="th">${x.r.f?`<img src="${e(x.r.f)}" alt="" onerror="this.replaceWith('${x.r.i}')">`:x.r.i}</div><b>${e(x.r.n)}</b><small>≈ ${x.r.k} kcal</small></button>`).join(""):"<p>Ninguna receta coincide. Prueba a marcar más gustos o cambiar la dieta.</p>";
  $("detalle-rec").classList.add("hidden");
}
$("recetas").onclick=ev=>{const b=ev.target.closest(".rec");if(!b)return;const r=R[b.dataset.i],d=$("detalle-rec");
  d.innerHTML=`<div class="foto">${r.f?`<img src="${e(r.f)}" alt="" onerror="this.replaceWith('${r.i}')">`:r.i}</div><h3>${e(r.n)}</h3><p><b>≈ ${r.k} kcal</b></p><h4>Ingredientes</h4><ul>${r.g.map(x=>"<li>"+e(x)+"</li>").join("")}</ul><h4>Preparación</h4><p>${e(r.p)}</p>`;
  d.classList.remove("hidden");d.scrollIntoView({behavior:"smooth"})};

// Cámara y diario
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function llamar(b){
  if(DEMO){await sleep(900);return b.tipo==="comida"?{plato:"Plato de ejemplo (demo)",kcal:520,consejo:"Añade más verdura para saciarte con menos calorías."}:{puntos:["Demo: colesterol algo elevado, conviene más fibra.","Demo: glucosa en rango normal."]}}
  const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
  const j=await r.json();if(j.error)throw new Error(j.error);return j}
function diario(){const l=S.diario[hoy()]||[],t=l.reduce((a,x)=>a+x.k,0),m=S.kcalDia||0;
  $("total").textContent=t+" kcal";$("resta").textContent=m?Math.max(m-t,0)+" de "+m+" kcal restantes":"Calcula tu plan en Inicio para ver tu objetivo";
  $("anillo").style.strokeDashoffset=327*(1-(m?Math.min(t/m,1):0));
  $("lista").innerHTML=l.map((x,i)=>`<li>${e(x.n)} · <b>${x.k} kcal</b><button class="x" data-i="${i}" aria-label="Borrar">✕</button></li>`).join("")||"<li>Aún no hay comidas hoy. ¡Haz tu primera foto!</li>"}
$("lista").onclick=ev=>{const b=ev.target.closest(".x");if(!b)return;S.diario[hoy()].splice(+b.dataset.i,1);guardar();diario()};
$("btnFoto").onclick=()=>$("foto").click();
$("foto").onchange=async ev=>{const f=ev.target.files[0];if(!f)return;
  $("prev").src=URL.createObjectURL(f);$("prev").classList.remove("hidden");
  const o=$("resFoto");o.innerHTML='<span class="spin"></span> Analizando tu plato...';
  try{const r=await llamar({tipo:"comida",data:await img64(f),mime:"image/jpeg",objetivo:$("objetivo").value,contexto:S.analitica||""});
    (S.diario[hoy()]=S.diario[hoy()]||[]).push({n:r.plato,k:Math.round(+r.kcal||0)});guardar();diario();
    o.innerHTML=`<h3>${e(r.plato)}</h3><p><b>≈ ${e(r.kcal)} kcal</b> añadidas a tu diario</p><p>💡 ${e(r.consejo)}</p><p>¡Genial! Fotografía cada comida y tendrás control real sin esfuerzo.</p>`;toast("Comida registrada")
  }catch(x){o.textContent="Error: "+x.message}ev.target.value=""};

// Ejercicios
let grupo="Pecho";
$("grupos").innerHTML=Object.keys(EJ).map(g=>`<button class="tab" data-g="${g}">${g}</button>`).join("");
function ejercicios(g){grupo=g;const ob=$("objetivo").value;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.g===g));
  $("notaEj").textContent=ob==="perder"?"Para perder peso: fuerza 3 días por semana y cardio 2-3 días.":ob==="ganar"?"Para ganar músculo: fuerza 4-5 días, sube peso poco a poco y descansa 48 h cada grupo.":"Para mantener: 3 días de fuerza y algo de cardio.";
  $("ejs").innerHTML=EJ[g].map(x=>`<li><b>${e(x[0])}</b> — ${e(x[1])}<br><small>${e(x[2])}</small></li>`).join("");
  $("rutina").innerHTML=RUT[ob].map(x=>"<li>"+e(x)+"</li>").join("")}
$("grupos").onclick=ev=>{const b=ev.target.closest(".tab");if(b)ejercicios(b.dataset.g)};

// Progreso: peso
$("btnPeso").onclick=()=>{const p=+$("pesoN").value;if(!p||p<30||p>300)return toast("Introduce un peso válido (30-300 kg)");
  S.peso=S.peso.filter(x=>x.d!==hoy());S.peso.push({d:hoy(),p});guardar();grafico();$("pesoN").value="";toast("Peso guardado ✅")};
function grafico(){const a=S.peso;if(a.length<2){$("graf").innerHTML="<p>Guarda tu peso en al menos 2 días distintos para ver la gráfica.</p>";return}
  const ps=a.map(x=>x.p),mn=Math.min(...ps)-1,mx=Math.max(...ps)+1,W=300,H=140,pt=a.map((x,i)=>[20+i*(W-40)/(a.length-1),H-20-(x.p-mn)/(mx-mn)*(H-40)]);
  $("graf").innerHTML=`<svg viewBox="0 0 ${W} ${H}"><polyline fill="none" stroke="#2e8b6e" stroke-width="3" points="${pt.map(q=>q.join(",")).join(" ")}"/>${pt.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#2e8b6e"/><text x="${q[0]}" y="${q[1]-8}" font-size="10" text-anchor="middle" fill="currentColor">${a[i].p}</text>`).join("")}</svg><p>Del ${a[0].d} al ${a[a.length-1].d}: <b>${(a[a.length-1].p-a[0].p).toFixed(1)} kg</b></p>`}

// Analíticas
$("btnAnal").onclick=async()=>{const f=$("anal").files[0],o=$("resAnal");
  if(!$("ok").checked)return toast("Debes aceptar el tratamiento de datos de salud");if(!f)return toast("Selecciona un archivo");if(f.size>5e6)return toast("Máximo 5 MB");
  o.innerHTML='<span class="spin"></span> Leyendo tu analítica...';
  try{const pdf=f.type==="application/pdf",r=await llamar({tipo:"analitica",data:pdf?await pdf64(f):await img64(f),mime:pdf?"application/pdf":"image/jpeg"});
    S.analitica=r.puntos.join(" | ");guardar();o.innerHTML="<ul>"+r.puntos.map(p=>"<li>"+e(p)+"</li>").join("")+"</ul><p><i>Guardado en tu móvil para personalizar los consejos. Consúltalo con tu médico.</i></p>"
  }catch(x){o.textContent="Error: "+x.message}};
$("btnBorrar").onclick=()=>{if(confirm("¿Borrar todos tus datos de este móvil?")){localStorage.removeItem("prog");sessionStorage.clear();location.reload()}};

recetas();ejercicios("Pecho");diario();grafico();if(S.kcalDia)$("btnCalc").click();
