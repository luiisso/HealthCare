// 1) Pon aquí la URL de tu Worker de Cloudflare (ver README)
const API_URL="https://TU-WORKER.workers.dev";
const $=id=>document.getElementById(id);
const e=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const S=JSON.parse(localStorage.getItem("prog")||"{}");
let kcalDia=S.kcalDia||0,total=0,obj=S.obj||"perder";
const guardar=()=>localStorage.setItem("prog",JSON.stringify(S));
const M={
perder:["Desayuno: yogur griego con frutos rojos y avena (≈300 kcal)","Comida: pollo a la plancha, verduras al horno y arroz integral (≈450)","Cena: merluza al horno con calabacín y patata (≈350)","Snack: fruta o un puñado de almendras (≈120)"],
ganar:["Desayuno: avena con leche, plátano y crema de cacahuete (≈600 kcal)","Comida: arroz con ternera, verduras y aceite de oliva (≈750)","Cena: salmón con boniato y brócoli (≈650)","Snack: batido de leche, plátano y frutos secos (≈400)"],
mantener:["Desayuno: tostada integral con tomate y huevo (≈350 kcal)","Comida: lentejas con verduras y fruta (≈500)","Cena: pescado a la plancha con ensalada (≈400)","Snack: yogur con frutos secos (≈200)"]};
const MSG=["📸 Quien fotografía sus comidas es más constante. ¡Haz hoy tu primera foto!","⚡ Solo 5 segundos: haz la foto y nosotros hacemos las cuentas.","🎯 Lo que se mide, se mejora. Cada foto te acerca a tu objetivo."];
$("motiv").textContent=MSG[Math.floor(Math.random()*MSG.length)];

$("btnCalc").onclick=()=>{
  const h=$("sexo").value==="h",ed=+$("edad").value,p=+$("peso").value,a=+$("altura").value;
  if(!ed||!p||!a)return alert("Rellena edad, peso y altura.");
  obj=$("objetivo").value;
  const mant=(10*p+6.25*a-5*ed+(h?5:-161))*$("actividad").value;
  const k=obj==="perder"?.8:obj==="ganar"?1.15:1;
  kcalDia=Math.round(mant*k);
  const pr=Math.round(p*(obj==="ganar"?2:1.8)),gr=Math.round(kcalDia*.25/9),ch=Math.round((kcalDia-pr*4-gr*9)/4);
  $("kcal").textContent=kcalDia+" kcal";
  $("detalle").textContent="Mantenimiento: "+Math.round(mant)+" kcal ("+(obj==="perder"?"déficit 20%":obj==="ganar"?"superávit 15%":"sin ajuste")+").";
  $("mP").textContent=pr+" g";$("mC").textContent=ch+" g";$("mG").textContent=gr+" g";
  $("comidas").innerHTML=M[obj].map(x=>"<li>"+e(x)+"</li>").join("");
  $("resultados").classList.remove("hidden");
  Object.assign(S,{kcalDia,obj});guardar();
};

const img64=f=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,1024/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",.8).split(",")[1])};i.src=URL.createObjectURL(f)});
const pdf64=f=>new Promise(r=>{const d=new FileReader();d.onload=()=>r(d.result.split(",")[1]);d.readAsDataURL(f)});
async function llamar(body){
  const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const j=await r.json();if(j.error)throw new Error(j.error);return j;
}

$("btnFoto").onclick=()=>$("foto").click();
$("foto").onchange=async ev=>{
  const f=ev.target.files[0];if(!f)return;
  $("prev").src=URL.createObjectURL(f);$("prev").classList.remove("hidden");
  const o=$("resFoto");o.classList.remove("hidden");o.textContent="Analizando tu plato...";
  try{
    const r=await llamar({tipo:"comida",data:await img64(f),mime:"image/jpeg",objetivo:obj,contexto:S.analitica||""});
    total+=+r.kcal||0;$("total").textContent=total;
    o.innerHTML="<h4>"+e(r.plato)+"</h4><p><b>≈ "+e(r.kcal)+" kcal</b></p><p>💡 "+e(r.consejo)+"</p>"+(kcalDia?"<p>Te quedan ≈ <b>"+Math.max(kcalDia-total,0)+" kcal</b> hoy.</p>":"")+"<p>¡Genial! Fotografía cada comida y tendrás control real sin esfuerzo.</p>";
  }catch(x){o.textContent="Error: "+x.message}
};

$("btnAnal").onclick=async()=>{
  const f=$("anal").files[0],o=$("resAnal");
  if(!$("ok").checked)return alert("Debes aceptar el tratamiento de datos de salud.");
  if(!f)return alert("Selecciona un archivo.");
  if(f.size>5e6)return alert("Máximo 5 MB.");
  o.classList.remove("hidden");o.textContent="Leyendo tu analítica...";
  try{
    const pdf=f.type==="application/pdf";
    const r=await llamar({tipo:"analitica",data:pdf?await pdf64(f):await img64(f),mime:pdf?"application/pdf":"image/jpeg"});
    S.analitica=r.puntos.join(" | ");guardar();
    o.innerHTML="<ul>"+r.puntos.map(p=>"<li>"+e(p)+"</li>").join("")+"</ul><p><i>Guardado en tu móvil para personalizar los consejos. Consúltalo con tu médico.</i></p>";
  }catch(x){o.textContent="Error: "+x.message}
};

// ---- Mensaje de bienvenida ----
const MOT=["Hoy es un gran día para cuidarte. ¡Un paso pequeño cuenta!","No tiene que ser perfecto, tiene que ser constante. 💪","Tu yo del futuro te dará las gracias por lo que hagas hoy.","Cada comida saludable y cada entrenamiento suman. ¡Tú puedes!","El progreso es lento pero seguro. Confía en el proceso."];
if(!sessionStorage.getItem("bienvenida")){$("modalTxt").textContent=MOT[Math.floor(Math.random()*MOT.length)];$("modal").classList.remove("hidden")}
$("modalBtn").onclick=()=>{$("modal").classList.add("hidden");sessionStorage.setItem("bienvenida","1")};

// ---- Gustos y recetas ----
// Para poner una foto real: sube el .jpg al repositorio y escribe su nombre en f (ej: f:"tortilla.jpg")
const GUSTOS=["pollo","pescado","huevo","carne","legumbres","arroz","pasta","verdura","fruta","lácteos","frutos secos"];
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
{n:"Batido de leche, plátano y frutos secos",i:"🥤",k:400,o:["ganar"],t:["lácteos","fruta","frutos secos"],g:["300 ml de leche","1 plátano","1 puñado de almendras","1 cda de avena"],p:"Tritura todo hasta que quede cremoso.",f:""}
];
$("gustos").innerHTML=GUSTOS.map(x=>`<label class="chip"><input type="checkbox" value="${x}" ${(S.gustos||[]).includes(x)?"checked":""}> ${x}</label>`).join("");
$("gustos").onchange=()=>{S.gustos=[...document.querySelectorAll("#gustos input:checked")].map(i=>i.value);guardar();recetas()};
$("objetivo").addEventListener("change",recetas);
function recetas(){
  const ob=$("objetivo").value,g=S.gustos||[];
  const l=R.filter(r=>r.o.includes(ob)).map(r=>({r,m:r.t.filter(t=>g.includes(t)).length})).filter(x=>!g.length||x.m).sort((a,b)=>b.m-a.m);
  $("recetas").innerHTML=l.length?l.map(x=>`<button class="rec" data-i="${R.indexOf(x.r)}"><span>${x.r.i}</span>${e(x.r.n)}<small>≈ ${x.r.k} kcal</small></button>`).join(""):"<p>Ninguna receta coincide con tus gustos. Marca más opciones.</p>";
  $("detalle-rec").classList.add("hidden");
}
$("recetas").onclick=ev=>{
  const b=ev.target.closest(".rec");if(!b)return;const r=R[b.dataset.i],d=$("detalle-rec");
  d.innerHTML=`<div class="foto">${r.f?`<img src="${e(r.f)}" alt="" onerror="this.replaceWith('${r.i}')">`:r.i}</div><h3>${e(r.n)}</h3><p><b>≈ ${r.k} kcal</b></p><h4>Ingredientes</h4><ul>${r.g.map(x=>"<li>"+e(x)+"</li>").join("")}</ul><h4>Preparación</h4><p>${e(r.p)}</p>`;
  d.classList.remove("hidden");d.scrollIntoView({behavior:"smooth"});
};
recetas();

// ---- Ejercicios de gimnasio ----
const EJ={
Pecho:[["Press de banca","4×8-10","Baja la barra al pecho con control, sin rebotar."],["Flexiones","3×10-15","Cuerpo recto de cabeza a talones."],["Aperturas con mancuernas","3×12","Codos ligeramente flexionados."]],
Espalda:[["Jalón al pecho","4×10","Tira con los codos, no con las manos."],["Remo con mancuerna","4×8-10","Espalda recta, aprieta los omóplatos."],["Dominadas asistidas","3×6-8","Baja lento."]],
Piernas:[["Sentadilla","4×8-10","Rodillas alineadas con los pies, espalda neutra."],["Peso muerto rumano","3×10","Cadera atrás, barra pegada a las piernas."],["Zancadas","3×12 por pierna","Paso largo y torso erguido."],["Prensa","3×12","No bloquees las rodillas."]],
Hombros:[["Press militar","4×8-10","Abdomen firme, sin arquear la espalda."],["Elevaciones laterales","3×12-15","Sube hasta la altura del hombro."]],
Brazos:[["Curl de bíceps","3×10-12","Codos pegados al cuerpo."],["Extensión de tríceps","3×10-12","Movimiento controlado."]],
Core:[["Plancha","3×30-45 s","Cuerpo recto, glúteos apretados."],["Elevación de piernas","3×12","Sin balancear."],["Crunch","3×15","Sube con el abdomen, no tirando del cuello."]],
Cardio:[["Caminar rápido o cinta inclinada","30-45 min","Ritmo en el que aún puedes hablar."],["Bicicleta","20-30 min","Resistencia moderada."],["Intervalos (1 min rápido, 2 suave)","15-20 min","Solo si tienes buena base."]]};
$("grupos").innerHTML=Object.keys(EJ).map(g=>`<button class="tab" data-g="${g}">${g}</button>`).join("");
function ejercicios(g){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.g===g));
  const ob=$("objetivo").value;
  $("notaEj").textContent=ob==="perder"?"Para perder peso: fuerza 3 días por semana y cardio 2-3 días.":ob==="ganar"?"Para ganar músculo: fuerza 4-5 días, sube el peso poco a poco y descansa 48 h cada grupo.":"Para mantener: 3 días de fuerza y algo de cardio.";
  $("ejs").innerHTML=EJ[g].map(x=>`<li><b>${e(x[0])}</b> — ${e(x[1])}<br><small>${e(x[2])}</small></li>`).join("");
}
$("grupos").onclick=ev=>{const b=ev.target.closest(".tab");if(b)ejercicios(b.dataset.g)};
$("objetivo").addEventListener("change",()=>ejercicios(document.querySelector(".tab.on").dataset.g));
ejercicios("Pecho");
