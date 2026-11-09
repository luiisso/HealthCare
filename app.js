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
