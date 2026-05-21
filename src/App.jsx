import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase.js";

// ─── Real Scannable QR Code ───────────────────────────────────────────────────
function QRCode({ value, size=120, color="#1a1a2e" }) {
  const canvasRef = useRef();
  useEffect(() => {
    if (!canvasRef.current) return;
    import("qrcode").then(mod => {
      const QRCodeLib = mod.default || mod;
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: { dark: color, light: "#ffffff" },
      });
    });
  }, [value, size, color]);
  return <canvas ref={canvasRef} style={{display:"block",borderRadius:8}} />;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();
const initials = n => n.trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
const genId = (seg, kids) => {
  const p = seg==="BALAK"?"B":"Y";
  const nums = kids.filter(k=>k.id.startsWith(p)).map(k=>parseInt(k.id.slice(1))||0);
  return `${p}${String(nums.length?Math.max(...nums)+1:1).padStart(3,"0")}`;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800;900&family=Nunito:wght@400;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --sf:#F97316;--deep:#1C1917;--gold:#F59E0B;
  --bl:#3B82F6;--bls:#EFF6FF;--blb:#BFDBFE;
  --yu:#8B5CF6;--yus:#F5F3FF;--yub:#DDD6FE;
  --gr:#22C55E;--rd:#EF4444;--am:#F59E0B;
  --bg:#FFFBF7;--card:#fff;--bdr:#FDE8D0;
  --tx:#1C1917;--mt:#78716C;--soft:#FFF7ED;
  --rr:14px;--sh:0 4px 20px rgba(249,115,22,.13);
}
body{font-family:'Nunito',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh}
.hdr{background:linear-gradient(135deg,#1C1917,#292524 60%,#1C1917);color:#fff;position:sticky;top:0;z-index:100;box-shadow:0 4px 24px rgba(0,0,0,.4)}
.hdr-in{max-width:1160px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:11px 18px}
.hdr-logo{width:44px;height:44px;border-radius:11px;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hdr-title{font-family:'Baloo 2',cursive;font-size:1.3rem;font-weight:900;line-height:1.1}
.hdr-sub{font-size:.7rem;opacity:.6;margin-top:2px;font-weight:700;letter-spacing:.06em}
.hdr-dt{margin-left:auto;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);border-radius:10px;padding:5px 13px;font-size:.76rem;text-align:right;flex-shrink:0}
.hdr-dt b{font-family:'Baloo 2',cursive;font-weight:900;display:block;font-size:.88rem}
.nav{background:#fff;border-bottom:2px solid var(--bdr);position:sticky;top:68px;z-index:90}
.nav-in{max-width:1160px;margin:0 auto;display:flex;overflow-x:auto}
.nb{padding:12px 16px;background:none;border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.83rem;font-weight:800;color:var(--mt);white-space:nowrap;border-bottom:3px solid transparent;transition:all .2s;display:flex;align-items:center;gap:5px}
.nb:hover{color:var(--sf)}
.nb.on{color:var(--sf);border-bottom-color:var(--sf)}
.nbdg{background:var(--sf);color:#fff;border-radius:20px;padding:1px 7px;font-size:.66rem}
.main{max-width:1160px;margin:0 auto;padding:20px 15px 70px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:11px;margin-bottom:22px}
.sc{background:#fff;border-radius:var(--rr);padding:14px;display:flex;align-items:center;gap:11px;box-shadow:var(--sh);border:1.5px solid var(--bdr);transition:transform .18s}
.sc:hover{transform:translateY(-2px)}
.sc-ic{font-size:1.7rem}
.sc-v{font-family:'Baloo 2',cursive;font-size:1.65rem;font-weight:900;line-height:1}
.sc-l{font-size:.7rem;color:var(--mt);font-weight:700;margin-top:1px;text-transform:uppercase;letter-spacing:.04em}
.stl{font-family:'Baloo 2',cursive;font-size:1.1rem;font-weight:800;margin-bottom:12px;display:flex;align-items:center;gap:7px;color:var(--deep)}
.seg-row{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.sbtn{padding:8px 20px;border-radius:40px;border:2px solid;cursor:pointer;font-family:'Baloo 2',cursive;font-weight:800;font-size:.9rem;transition:all .2s;display:flex;align-items:center;gap:6px}
.sb-all{border-color:var(--sf);color:var(--sf);background:#fff}.sb-all.on,.sb-all:hover{background:var(--sf);color:#fff;box-shadow:0 4px 14px rgba(249,115,22,.3)}
.sb-bl{border-color:var(--bl);color:var(--bl);background:#fff}.sb-bl.on,.sb-bl:hover{background:var(--bl);color:#fff;box-shadow:0 4px 14px rgba(59,130,246,.3)}
.sb-yu{border-color:var(--yu);color:var(--yu);background:#fff}.sb-yu.on,.sb-yu:hover{background:var(--yu);color:#fff;box-shadow:0 4px 14px rgba(139,92,246,.3)}
.stops-row{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px}
.sp{background:#fff;border:2px solid var(--bdr);border-radius:40px;padding:7px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;transition:all .2s;font-size:.83rem;font-weight:700}
.sp:hover{border-color:var(--sf);background:var(--soft)}
.sp.on{background:var(--sf);border-color:var(--sf);color:#fff;box-shadow:0 4px 12px rgba(249,115,22,.35)}
.sp-n{width:19px;height:19px;border-radius:50%;background:rgba(255,255,255,.25);font-size:.65rem;font-weight:800;display:flex;align-items:center;justify-content:center}
.sp-t{font-size:.66rem;opacity:.75;font-weight:500}
.panel{background:#fff;border-radius:var(--rr);border:2px solid var(--bdr);box-shadow:var(--sh);padding:22px;margin-bottom:22px}
.fr{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:11px;margin-bottom:11px}
.fld label{display:block;font-size:.72rem;font-weight:800;color:var(--mt);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em}
.inp{width:100%;padding:9px 13px;border-radius:9px;border:2px solid var(--bdr);font-family:'Nunito',sans-serif;font-size:.88rem;outline:none;transition:border-color .2s;background:#fff}
.inp:focus{border-color:var(--sf)}
.btn{padding:9px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'Baloo 2',cursive;font-weight:800;font-size:.9rem;transition:all .2s;display:inline-flex;align-items:center;gap:5px}
.bp{background:var(--sf);color:#fff}.bp:hover{background:#e56510;transform:scale(1.03);box-shadow:0 4px 14px rgba(249,115,22,.35)}
.bg{background:var(--soft);color:var(--sf);border:2px solid var(--bdr)}.bg:hover{background:var(--bdr)}
.byu{background:var(--yu);color:#fff}.byu:hover{background:#7c3aed}
.bbl{background:var(--bl);color:#fff}.bbl:hover{background:#2563eb}
.bd{background:#fee2e2;color:var(--rd)}.bd:hover{background:var(--rd);color:#fff}
.bsm{padding:5px 11px;font-size:.78rem}
.bfw{width:100%;justify-content:center}
.scan-box{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.scan-anim{width:86px;height:86px;border-radius:12px;background:var(--soft);border:2px dashed var(--sf);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:1.9rem;animation:pulse 2s ease-in-out infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.75;transform:scale(.97)}}
.sr{margin-top:11px;padding:10px 14px;border-radius:9px;font-weight:700;font-size:.88rem;display:flex;align-items:center;gap:7px}
.sr-ok{background:#dcfce7;color:#15803d;border:1.5px solid #86efac}
.sr-er{background:#fee2e2;color:#b91c1c;border:1.5px solid #fca5a5}
.sr-wn{background:#fef9c3;color:#854d0e;border:1.5px solid #fde047}
.abs-alrt{background:#fff7ed;border:2px solid #fed7aa;border-radius:12px;padding:13px 17px;margin-bottom:18px}
.atag{background:#fee2e2;color:#b91c1c;border-radius:20px;padding:3px 10px;font-size:.78rem;font-weight:700;display:inline-flex;align-items:center;gap:4px;cursor:pointer;transition:background .15s}
.atag:hover{background:#fca5a5}
.kgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:11px}
.kc{background:#fff;border-radius:var(--rr);border:2px solid var(--bdr);padding:15px;box-shadow:0 2px 10px rgba(249,115,22,.07);transition:all .2s;cursor:pointer}
.kc:hover{transform:translateY(-2px);box-shadow:var(--sh);border-color:var(--sf)}
.kc.p{border-top:4px solid var(--gr)}.kc.a{border-top:4px solid #e5e7eb}
.kc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:7px}
.av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Baloo 2',cursive;font-weight:900;color:#fff;font-size:.95rem;flex-shrink:0}
.av-bl{background:linear-gradient(135deg,var(--bl),#60a5fa)}
.av-yu{background:linear-gradient(135deg,var(--yu),#a78bfa)}
.kc-name{font-weight:800;font-size:.92rem;margin-bottom:1px}
.kc-mt{font-size:.73rem;color:var(--mt)}
.kbdg{font-size:.66rem;font-weight:800;padding:2px 8px;border-radius:20px;white-space:nowrap}
.bp2{background:#dcfce7;color:#15803d}.ba2{background:#f3f4f6;color:#6b7280}
.stag{font-size:.63rem;font-weight:800;padding:2px 7px;border-radius:20px;margin-top:3px;display:inline-block}
.st-bl{background:var(--bls);color:var(--bl)}.st-yu{background:var(--yus);color:var(--yu)}
.kc-id{font-size:.67rem;color:var(--mt);font-family:monospace;margin-top:4px}
.kdots{display:flex;gap:3px;flex-wrap:wrap;margin-top:6px}
.dot{width:22px;height:22px;border-radius:50%;font-size:.58rem;display:flex;align-items:center;justify-content:center;font-weight:700}
.dot-on{background:var(--gr);color:#fff}.dot-off{background:#f3f4f6;color:#9ca3af}
.tbl-w{overflow-x:auto;border-radius:var(--rr);box-shadow:var(--sh)}
.tbl{width:100%;border-collapse:collapse;background:#fff;font-size:.82rem}
.tbl th{background:var(--deep);color:#fff;padding:11px 12px;text-align:left;font-size:.73rem;font-weight:800;letter-spacing:.04em;white-space:nowrap}
.tbl th:first-child{border-radius:14px 0 0 0}.tbl th:last-child{border-radius:0 14px 0 0}
.tbl td{padding:10px 12px;border-bottom:1px solid #f5f5f4;vertical-align:middle}
.tbl tr:hover td{background:var(--soft)}.tbl tr:last-child td{border-bottom:none}
.qrg{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:15px}
.qrc{background:#fff;border-radius:16px;border:2px solid var(--bdr);overflow:hidden;box-shadow:0 4px 16px rgba(249,115,22,.10);transition:transform .2s}
.qrc:hover{transform:translateY(-3px)}
.qrc-hdr{padding:8px 11px;display:flex;align-items:center;justify-content:space-between;font-size:.62rem;font-weight:800;letter-spacing:.08em;color:#fff}
.qh-bl{background:linear-gradient(90deg,#1C1917,#1e3a5f)}
.qh-yu{background:linear-gradient(90deg,#1C1917,#2e1065)}
.qrc-body{padding:14px 13px;text-align:center}
.mo{position:fixed;inset:0;background:rgba(28,25,23,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.md{background:#fff;border-radius:20px;padding:26px;max-width:350px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.35);animation:mdin .22s ease}
@keyframes mdin{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
.md-av{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Baloo 2',cursive;font-weight:900;color:#fff;font-size:1.35rem;margin:0 auto 11px}
.md-n{font-family:'Baloo 2',cursive;font-weight:900;font-size:1.2rem;text-align:center;margin-bottom:3px}
.md-m{font-size:.8rem;color:var(--mt);text-align:center;margin-bottom:16px}
.mdstops{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;margin-bottom:16px}
.mds{display:flex;align-items:center;gap:4px;padding:4px 9px;border-radius:20px;font-size:.73rem;font-weight:700}
.mds-ok{background:#dcfce7;color:#15803d}.mds-no{background:#f3f4f6;color:#9ca3af}
.empty{text-align:center;padding:44px 20px;color:var(--mt)}
.em-ic{font-size:2.8rem;margin-bottom:10px}
.em-t{font-size:.95rem;font-weight:700}
.em-s{font-size:.8rem;margin-top:3px}
.ctrl{display:flex;gap:9px;margin-bottom:13px;flex-wrap:wrap;align-items:center}
.srch{flex:1;min-width:155px;padding:9px 13px;border-radius:9px;border:2px solid var(--bdr);font-family:'Nunito',sans-serif;font-size:.86rem;outline:none}
.srch:focus{border-color:var(--sf)}
.dvdr{border:none;border-top:2px solid var(--bdr);margin:18px 0}
.list-row{display:flex;align-items:center;gap:9px;background:var(--soft);border-radius:10px;padding:9px 13px;border:1.5px solid var(--bdr)}
.list-row-bl{background:var(--bls);border-color:var(--blb)}
.list-row-yu{background:var(--yus);border-color:var(--yub)}
@media(max-width:600px){.hdr-dt{display:none}.fr{grid-template-columns:1fr}}
`;

const ICONS = ["📍","🛕","🏛️","🔭","🎡","🌳","🍱","🎢","⛵","🏠","🚌","🎠","🏕️","🌄","⛩️","🏖️","🎪","🏟️"];

export default function App() {
  const [tab, setTab] = useState("scan");
  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState({ name:"", icon:"📍", time:"" });
  const [activeStop, setActiveStop] = useState(null);
  const [kids, setKids] = useState([]);
  const [newKid, setNewKid] = useState({ name:"", segment:"BALAK", phone:"" });
  const [att, setAtt] = useState({});
  const [scanIn, setScanIn] = useState("");
  const [scanRes, setScanRes] = useState(null);
  const [segF, setSegF] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selKid, setSelKid] = useState(null);
  const [camOn, setCamOn] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const scanRef = useRef();
  const timer = useRef();
  const qrRef = useRef();
  const html5QrRef = useRef(null);
  // Use refs so camera callback always has latest values without restarting camera
  const kidsRef = useRef(kids);
  const attRef = useRef(att);
  const activeStopRef = useRef(activeStop);
  useEffect(() => { kidsRef.current = kids; }, [kids]);
  useEffect(() => { attRef.current = att; }, [att]);
  useEffect(() => { activeStopRef.current = activeStop; }, [activeStop]);

  // ── Camera QR scanner — only restarts when camOn changes ──
  useEffect(() => {
    if (!camOn) {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(()=>{});
        html5QrRef.current = null;
      }
      return;
    }
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      const scanner = new Html5Qrcode("qr-reader");
      html5QrRef.current = scanner;
      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => {
          const id = text.trim().toUpperCase();
          clearTimeout(timer.current);
          let res;
          const curStop = activeStopRef.current;
          const curKids = kidsRef.current;
          const curAtt  = attRef.current;
          if (!curStop) res={ t:"er", msg:"⚠️ Select a stop first!" };
          else {
            const kid = curKids.find(k=>k.id===id);
            if (!kid) res={ t:"er", msg:`❌ ID "${id}" not found` };
            else if (curAtt[kid.id]?.has(curStop)) res={ t:"wn", msg:`⚠️ ${kid.name} already checked here!` };
            else { mark(kid.id, curStop); res={ t:"ok", msg:`✅ ${kid.name} (${kid.segment}) marked present!` }; }
          }
          setScanRes(res);
          timer.current = setTimeout(()=>setScanRes(null), 4000);
        },
        ()=>{}
      ).catch(()=>setCamOn(false));
    });
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(()=>{});
        html5QrRef.current = null;
      }
    };
  }, [camOn]);

  // ── Load all data + realtime ──
  useEffect(() => {
    const load = async () => {
      const [{ data: kidsData }, { data: stopsData }, { data: attData }] = await Promise.all([
        supabase.from("kids").select("*").order("created_at"),
        supabase.from("stops").select("*").order("created_at"),
        supabase.from("attendance").select("*"),
      ]);
      if (kidsData) setKids(kidsData);
      if (stopsData) {
        setStops(stopsData);
        setActiveStop(p => p || stopsData[0]?.id || null);
      }
      if (attData) {
        const map = {};
        attData.forEach(a => {
          if (!map[a.kid_id]) map[a.kid_id] = new Set();
          map[a.kid_id].add(a.stop_id);
        });
        setAtt(map);
      }
    };
    load();

    const ch = supabase.channel("db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "kids" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "stops" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, load)
      .subscribe();

    return () => ch.unsubscribe();
  }, []);

  // ── Stop actions ──
  const addStop = async () => {
    if (!newStop.name.trim()) return;
    const s = { id:`S${uid()}`, ...newStop, name:newStop.name.trim() };
    await supabase.from("stops").insert(s);
    if (!activeStop) setActiveStop(s.id);
    setNewStop({ name:"", icon:"📍", time:"" });
  };
  const delStop = async id => {
    await supabase.from("stops").delete().eq("id", id);
    if (activeStop===id) setActiveStop(stops.find(s=>s.id!==id)?.id||null);
  };

  // ── Kid actions ──
  const addKid = async () => {
    if (!newKid.name.trim()) return;
    const id = genId(newKid.segment, kids);
    const k = { id, ...newKid, name:newKid.name.trim(), };
    await supabase.from("kids").insert(k);
    setNewKid(p => ({ name:"", segment:p.segment, phone:"" }));
  };
  const delKid = async id => {
    await supabase.from("kids").delete().eq("id", id);
  };

  // ── Scan ──
  const mark = async (kidId, stopId=activeStop) => {
    if (!stopId) return;
    // Optimistic UI update so scan feels instant
    setAtt(p => ({ ...p, [kidId]: new Set([...(p[kidId]||[]), stopId]) }));
    await supabase.from("attendance").insert({ kid_id: kidId, stop_id: stopId });
  };
  const doScan = () => {
    const id = scanIn.trim().toUpperCase();
    clearTimeout(timer.current);
    let res;
    if (!activeStop) res={ t:"er", msg:"⚠️ Select a stop first!" };
    else if (!id) res={ t:"er", msg:"⚠️ Enter a Kid ID" };
    else {
      const kid = kids.find(k=>k.id===id);
      if (!kid) res={ t:"er", msg:`❌ ID "${id}" not found` };
      else if (att[kid.id]?.has(activeStop)) res={ t:"wn", msg:`⚠️ ${kid.name} already checked here!` };
      else { mark(kid.id); res={ t:"ok", msg:`✅ ${kid.name} (${kid.segment}) marked present!` }; }
    }
    setScanRes(res);
    setScanIn("");
    timer.current = setTimeout(()=>setScanRes(null), 3500);
    scanRef.current?.focus();
  };

  // ── Derived ──
  const present = id => att[id]?.has(activeStop);
  const presentCnt = kids.filter(k=>present(k.id)).length;
  const absentKids = kids.filter(k=>!present(k.id));
  const filtKids = kids.filter(k=>{
    const ms = segF==="ALL"||k.segment===segF;
    const mq = k.name.toLowerCase().includes(search.toLowerCase())||k.id.includes(search.toUpperCase());
    return ms&&mq;
  });
  const curStop = stops.find(s=>s.id===activeStop);

  // ── Download QR PDF ──
  const downloadPDF = async () => {
    const filteredKids = kids.filter(k => segF === "ALL" || k.segment === segF);
    if (!filteredKids.length) return;
    setPdfLoading(true);
    try {
      const [{ default: jsPDF }, QRCodeLib] = await Promise.all([
        import("jspdf"),
        import("qrcode"),
      ]);

      const loadImg = (path) => new Promise(res => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.width; c.height = img.height;
          c.getContext("2d").drawImage(img, 0, 0);
          res(c.toDataURL("image/png"));
        };
        img.onerror = () => res(null);
        img.src = path;
      });

      const [logoLeft, bottomStrip] = await Promise.all([
        loadImg("/logo-left.png"),
        loadImg("/bottom-image.png"),
      ]);

      // Card dimensions
      const cardW = 95;   // mm wide
      const cardH = 65;   // mm tall
      const stripH = 18;  // bottom strip height mm
      const cols = 2;
      const gapX = 5;
      const gapY = 4;
      const marginX = (210 - cols * cardW - gapX) / 2;
      const marginY = 8;
      const CONTACT = "9081840511 / 8160026021";
      const logoS = 26;

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      let col = 0, pageRow = 0;

      for (let i = 0; i < filteredKids.length; i++) {
        const kid = filteredKids[i];
        const isBalak = kid.segment === "BALAK";

        if (pageRow >= 4) { doc.addPage(); pageRow = 0; col = 0; }

        const x = marginX + col * (cardW + gapX);
        const y = marginY + pageRow * (cardH + gapY);

        // ── CARD BACKGROUND + BORDER ──
        doc.setFillColor(252, 249, 243);
        doc.setDrawColor(185, 148, 80);
        doc.setLineWidth(0.7);
        doc.roundedRect(x, y, cardW, cardH, 3, 3, "FD");

        // Gold accent top line
        doc.setFillColor(200, 158, 70);
        doc.rect(x + 3, y + 1.2, cardW - 6, 0.8, "F");

        // ── LEFT LOGO ──
        const logoX = x + 2;
        const logoY = y + (cardH - stripH - logoS) / 2 + 2;
        if (logoLeft) {
          doc.addImage(logoLeft, "PNG", logoX, logoY, logoS, logoS);
        } else {
          const lx = logoX + logoS/2, ly = logoY + logoS/2;
          doc.setFillColor(210, 165, 65); doc.circle(lx, ly, logoS/2, "F");
          doc.setTextColor(90, 45, 5);
          doc.setFont("helvetica", "bold"); doc.setFontSize(5);
          doc.text("Satpurush", lx, ly, { align: "center" });
        }

        // ── DIVIDER ──
        const divL = x + logoS + 5;
        const divR = x + cardW - 3;
        const cw = divR - divL;
        const ccx = divL + cw / 2;
        doc.setDrawColor(195, 168, 118);
        doc.setLineWidth(0.3);
        doc.line(divL, y + 4, divL, y + cardH - stripH - 2);

        // ── NAME ──
        doc.setTextColor(12, 12, 12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        const nameLines = doc.splitTextToSize(kid.name.toUpperCase(), cw - 4);
        const nameY = y + 10;
        doc.text(nameLines, ccx, nameY, { align: "center" });
        const nameEndY = nameY + (nameLines.length - 1) * 5;

        // Underline
        doc.setDrawColor(70, 70, 70);
        doc.setLineWidth(0.3);
        doc.line(divL + 4, nameEndY + 2.5, divR - 4, nameEndY + 2.5);

        // ── SEGMENT ──
        doc.setTextColor(45, 45, 45);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text(kid.segment.split("").join("  "), ccx, nameEndY + 8, { align: "center" });

        // ── PHONE ──
        const phY = nameEndY + 15;
        doc.setFillColor(45, 45, 45);
        doc.roundedRect(divL + 1, phY - 3.5, 8, 4.5, 1, 1, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5);
        doc.text("Ph:", divL + 5, phY - 0.5, { align: "center" });
        doc.setTextColor(15, 15, 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text(CONTACT, divL + 11, phY, {});

        // ── QR CODE ──
        // Available space between phone and strip
        const contentBottom = y + cardH - stripH - 3;
        const qrSize = Math.min(30, contentBottom - phY - 6);
        const qrY = phY + 5;
        const qrX = ccx - qrSize / 2;

        const qrCanvas = document.createElement("canvas");
        await QRCodeLib.default.toCanvas(qrCanvas, kid.id, {
          width: 180, margin: 1,
          color: { dark: "#111111", light: "#ffffff" }
        });
        const qrDataUrl = qrCanvas.toDataURL("image/png");
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(140, 165, 210);
        doc.setLineWidth(0.5);
        doc.roundedRect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, 2, 2, "FD");
        doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

        // ── ID ──
        doc.setTextColor(85, 90, 125);
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.text(kid.id, ccx, qrY + qrSize + 5, { align: "center" });

        // ── BOTTOM STRIP ──
        const stripY = y + cardH - stripH;
        if (bottomStrip) {
          doc.addImage(bottomStrip, "PNG", x, stripY, cardW, stripH);
          // White covers for square bottom corners
          const cr = 3;
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(255, 255, 255);
          doc.rect(x, y + cardH - cr, cr, cr, "F");
          doc.rect(x + cardW - cr, y + cardH - cr, cr, cr, "F");
        }

        // Redraw border on top of everything
        doc.setDrawColor(185, 148, 80);
        doc.setLineWidth(0.7);
        doc.roundedRect(x, y, cardW, cardH, 3, 3, "S");

        col++;
        if (col >= cols) { col = 0; pageRow++; }
      }

      doc.save("BAPS-Chikhodara-QR-Cards.pdf");
    } catch (e) {
      console.error(e);
      alert("PDF failed: " + e.message);
    }
    setPdfLoading(false);
  };

  return (
    <>
      <style>{S}</style>

      <header className="hdr">
        <div className="hdr-in">
          <div className="hdr-logo">
            <img src="/logo-right.png" alt="BAPS" style={{width:"44px",height:"44px",objectFit:"cover",display:"block"}} />
          </div>
          <div>
            <div className="hdr-title">BAPS Chikhodara Mandal</div>
            <div className="hdr-sub">KIDS TRIP · QR ATTENDANCE</div>
          </div>
          <div className="hdr-dt">
            <b>{new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</b>
            {new Date().toLocaleDateString("en-IN",{weekday:"long"})}
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-in">
          {[{id:"scan",ic:"📷",lb:"Scan"},{id:"setup",ic:"⚙️",lb:"Setup"},{id:"kids",ic:"👦",lb:"Kids",cnt:kids.length},{id:"sheet",ic:"📋",lb:"Sheet"},{id:"qr",ic:"🪪",lb:"QR Cards"}].map(t=>(
            <button key={t.id} className={`nb ${tab===t.id?"on":""}`} onClick={()=>{setTab(t.id);if(t.id==="scan")setTimeout(()=>scanRef.current?.focus(),100)}}>
              {t.ic} {t.lb}
              {t.cnt!==undefined&&<span className="nbdg">{t.cnt}</span>}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {/* Stats */}
        <div className="stats">
          {[
            {ic:"🧒",v:kids.filter(k=>k.segment==="BALAK").length,l:"Balak",c:"var(--bl)"},
            {ic:"👦",v:kids.filter(k=>k.segment==="YUVAK").length,l:"Yuvak",c:"var(--yu)"},
            {ic:"✅",v:presentCnt,l:"Present",c:"var(--gr)"},
            {ic:"❓",v:absentKids.length,l:"Absent",c:"var(--rd)"},
            {ic:"🗺️",v:stops.length,l:"Stops",c:"var(--sf)"},
          ].map((s,i)=>(
            <div key={i} className="sc" style={{borderTop:`4px solid ${s.c}`}}>
              <div className="sc-ic">{s.ic}</div>
              <div><div className="sc-v" style={{color:s.c}}>{s.v}</div><div className="sc-l">{s.l}</div></div>
            </div>
          ))}
        </div>

        {/* Stop selector */}
        {tab!=="setup"&&tab!=="qr"&&stops.length>0&&(
          <>
            <div className="stl">🗺️ Current Stop</div>
            <div className="stops-row">
              {stops.map((s,i)=>(
                <div key={s.id} className={`sp ${activeStop===s.id?"on":""}`} onClick={()=>setActiveStop(s.id)}>
                  <span className="sp-n">{i+1}</span>
                  <span>{s.icon} {s.name}</span>
                  {s.time&&<span className="sp-t">{s.time}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══ SCAN ═══ */}
        {tab==="scan"&&(
          <>
            <div className="stl">📷 Mark Attendance {curStop&&`— ${curStop.icon} ${curStop.name}`}</div>
            {stops.length===0||kids.length===0?(
              <div className="empty"><div className="em-ic">⚙️</div><div className="em-t">Setup Required</div><div className="em-s">Go to <strong>Setup</strong> tab to add stops &amp; kids</div></div>
            ):(
              <>
                <div className="panel">
                  {/* Camera toggle */}
                  <div style={{display:"flex",gap:9,marginBottom:14,flexWrap:"wrap"}}>
                    <button className={`btn ${camOn?"bd":"bp"}`} onClick={()=>setCamOn(p=>!p)}>
                      {camOn ? "⏹ Stop Camera" : "📷 Open Camera Scanner"}
                    </button>
                  </div>

                  {/* Live camera view */}
                  {camOn&&(
                    <div style={{marginBottom:14}}>
                      <div id="qr-reader" style={{width:"100%",maxWidth:400,borderRadius:12,overflow:"hidden",border:"2px solid var(--sf)"}}/>
                      <div style={{fontSize:".75rem",color:"var(--mt)",marginTop:6}}>📱 Point camera at kid's QR card</div>
                    </div>
                  )}

                  {/* Manual input */}
                  <div className="scan-box">
                    <div className="scan-anim">📲<div style={{fontSize:".58rem",marginTop:5,fontFamily:"Nunito",fontWeight:800,color:"var(--sf)"}}>Scan QR</div></div>
                    <div style={{flex:1,minWidth:210}}>
                      <div style={{fontSize:".72rem",fontWeight:800,color:"var(--mt)",marginBottom:5,textTransform:"uppercase",letterSpacing:".05em"}}>Or Type Kid ID Manually</div>
                      <div style={{display:"flex",gap:9}}>
                        <input ref={scanRef} className="inp" style={{flex:1}} placeholder="B001 or Y002…" value={scanIn}
                          onChange={e=>setScanIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doScan()} />
                        <button className="btn bp" onClick={doScan}>Mark ✓</button>
                      </div>
                      {scanRes&&<div className={`sr sr-${scanRes.t}`}>{scanRes.msg}</div>}
                      <div style={{marginTop:9,fontSize:".73rem",color:"var(--mt)"}}>
                        Format: <strong>B001</strong> (Balak) &nbsp;·&nbsp; <strong>Y001</strong> (Yuvak) &nbsp;·&nbsp; Press Enter to mark
                      </div>
                    </div>
                  </div>
                </div>
                {absentKids.length>0&&activeStop&&(
                  <div className="abs-alrt">
                    <div style={{fontWeight:800,color:"#c2410c",marginBottom:7,fontSize:".87rem"}}>⚠️ {absentKids.length} not checked at this stop:</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {absentKids.map(k=>(
                        <span key={k.id} className="atag" onClick={()=>mark(k.id)} title="Click to quick-mark">
                          {k.segment==="BALAK"?"🧒":"👦"} {k.name} <span style={{fontFamily:"monospace",fontSize:".68rem"}}>({k.id})</span>
                        </span>
                      ))}
                    </div>
                    <div style={{fontSize:".7rem",color:"var(--mt)",marginTop:5}}>Click a name to quick-mark present</div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ═══ SETUP ═══ */}
        {tab==="setup"&&(
          <>
            <div className="stl">🗺️ Add Trip Stops</div>
            <div className="panel">
              <div className="fr">
                <div className="fld">
                  <label>Stop Name *</label>
                  <input className="inp" placeholder="e.g. Akshardham Mandir" value={newStop.name}
                    onChange={e=>setNewStop(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addStop()} />
                </div>
                <div className="fld">
                  <label>Icon</label>
                  <select className="inp" value={newStop.icon} onChange={e=>setNewStop(p=>({...p,icon:e.target.value}))}>
                    {ICONS.map(ic=><option key={ic} value={ic}>{ic} {ic}</option>)}
                  </select>
                </div>
                <div className="fld">
                  <label>Time (optional)</label>
                  <input className="inp" placeholder="9:30 AM" value={newStop.time}
                    onChange={e=>setNewStop(p=>({...p,time:e.target.value}))} />
                </div>
              </div>
              <button className="btn bp" onClick={addStop}>＋ Add Stop</button>
              {stops.length>0&&(
                <div style={{marginTop:16}}>
                  <div style={{fontSize:".72rem",fontWeight:800,color:"var(--mt)",marginBottom:7,textTransform:"uppercase",letterSpacing:".05em"}}>{stops.length} Stop{stops.length!==1?"s":""}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {stops.map((s,i)=>(
                      <div key={s.id} className="list-row">
                        <span style={{background:"var(--sf)",color:"#fff",borderRadius:"50%",width:21,height:21,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:800,flexShrink:0}}>{i+1}</span>
                        <span style={{fontSize:"1.1rem"}}>{s.icon}</span>
                        <span style={{fontWeight:700,flex:1}}>{s.name}</span>
                        {s.time&&<span style={{fontSize:".72rem",color:"var(--mt)",background:"#fff",border:"1px solid var(--bdr)",borderRadius:6,padding:"2px 7px"}}>{s.time}</span>}
                        <button className="btn bd bsm" onClick={()=>delStop(s.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <hr className="dvdr"/>

            <div className="stl">👦 Add Kids</div>
            <div className="panel">
              <div style={{marginBottom:13}}>
                <div style={{fontSize:".72rem",fontWeight:800,color:"var(--mt)",marginBottom:7,textTransform:"uppercase",letterSpacing:".05em"}}>Segment</div>
                <div style={{display:"flex",gap:9}}>
                  <button className={`btn ${newKid.segment==="BALAK"?"bbl":"bg"}`} onClick={()=>setNewKid(p=>({...p,segment:"BALAK"}))}>🧒 BALAK</button>
                  <button className={`btn ${newKid.segment==="YUVAK"?"byu":"bg"}`} onClick={()=>setNewKid(p=>({...p,segment:"YUVAK"}))}>👦 YUVAK</button>
                </div>
              </div>
              <div className="fr">
                <div className="fld">
                  <label>Full Name *</label>
                  <input className="inp" placeholder="Aarav Patel" value={newKid.name}
                    onChange={e=>setNewKid(p=>({...p,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addKid()} />
                </div>
                <div className="fld">
                  
                </div>
                <div className="fld">
                  <label>Parent Phone</label>
                  <input className="inp" placeholder="98765-43210" value={newKid.phone}
                    onChange={e=>setNewKid(p=>({...p,phone:e.target.value}))} />
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <button className="btn bp" onClick={addKid}>＋ Add Kid</button>
                <div style={{fontSize:".78rem",color:"var(--mt)"}}>
                  Auto ID: <strong style={{color:newKid.segment==="BALAK"?"var(--bl)":"var(--yu)",fontFamily:"monospace"}}>{genId(newKid.segment,kids)}</strong>
                </div>
              </div>
              {kids.length>0&&(
                <div style={{marginTop:16}}>
                  <div style={{fontSize:".72rem",fontWeight:800,color:"var(--mt)",marginBottom:7,textTransform:"uppercase",letterSpacing:".05em"}}>{kids.length} Kid{kids.length!==1?"s":""}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {kids.map(k=>(
                      <div key={k.id} className={`list-row list-row-${k.segment.toLowerCase()}`}>
                        <div className={`av av-${k.segment.toLowerCase()}`} style={{width:33,height:33,fontSize:".83rem"}}>{initials(k.name)}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:800,fontSize:".88rem"}}>{k.name}</div>
                          <div style={{fontSize:".7rem",color:"var(--mt)"}}>{k.phone||"–"}</div>
                        </div>
                        <span className={`stag st-${k.segment.toLowerCase()}`}>{k.segment}</span>
                        <code style={{fontSize:".75rem",fontWeight:700,background:"#fff",borderRadius:6,padding:"2px 7px"}}>{k.id}</code>
                        <button className="btn bd bsm" onClick={()=>delKid(k.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ KIDS ═══ */}
        {tab==="kids"&&(
          <>
            <div className="stl">👦 All Kids</div>
            <div className="seg-row">
              {[["ALL","sb-all","🌐 All",kids.length],["BALAK","sb-bl","🧒 Balak",kids.filter(k=>k.segment==="BALAK").length],["YUVAK","sb-yu","👦 Yuvak",kids.filter(k=>k.segment==="YUVAK").length]].map(([v,c,l,n])=>(
                <button key={v} className={`sbtn ${c} ${segF===v?"on":""}`} onClick={()=>setSegF(v)}>{l} <span style={{fontSize:".75rem",opacity:.8}}>({n})</span></button>
              ))}
            </div>
            <div className="ctrl">
              <input className="srch" placeholder="🔍 Search name or ID…" value={search} onChange={e=>setSearch(e.target.value)}/>
              <span style={{fontSize:".78rem",color:"var(--mt)"}}>{filtKids.length} of {kids.length}</span>
            </div>
            {filtKids.length===0?(
              <div className="empty"><div className="em-ic">👤</div><div className="em-t">No kids found</div><div className="em-s">Add kids from Setup tab</div></div>
            ):(
              <div className="kgrid">
                {filtKids.map(kid=>{
                  const isP=present(kid.id);
                  return (
                    <div key={kid.id} className={`kc ${isP?"p":"a"}`} onClick={()=>setSelKid(kid)}>
                      <div className="kc-top">
                        <div style={{display:"flex",gap:9,alignItems:"center"}}>
                          <div className={`av av-${kid.segment.toLowerCase()}`}>{initials(kid.name)}</div>
                          <div>
                            <div className="kc-name">{kid.name}</div>
                            
                            <span className={`stag st-${kid.segment.toLowerCase()}`}>{kid.segment}</span>
                          </div>
                        </div>
                        <span className={`kbdg ${isP?"bp2":"ba2"}`}>{isP?"✅ Present":"⬜ Absent"}</span>
                      </div>
                      <div className="kc-id">{kid.id} · {kid.phone||"No phone"}</div>
                      {stops.length>0&&<div className="kdots">{stops.map(s=><div key={s.id} className={`dot ${att[kid.id]?.has(s.id)?"dot-on":"dot-off"}`} title={s.name}>{s.icon}</div>)}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══ SHEET ═══ */}
        {tab==="sheet"&&(
          <>
            <div className="stl">📋 Attendance Sheet</div>
            {kids.length===0||stops.length===0?(
              <div className="empty"><div className="em-ic">📋</div><div className="em-t">No data yet</div><div className="em-s">Add stops &amp; kids in Setup</div></div>
            ):(
              <>
                <div className="seg-row" style={{marginBottom:13}}>
                  {[["ALL","sb-all","🌐 All"],["BALAK","sb-bl","🧒 Balak"],["YUVAK","sb-yu","👦 Yuvak"]].map(([v,c,l])=>(
                    <button key={v} className={`sbtn ${c} ${segF===v?"on":""}`} onClick={()=>setSegF(v)}>{l}</button>
                  ))}
                </div>
                <div className="tbl-w">
                  <table className="tbl">
                    <thead><tr>
                      <th>ID</th><th>Name</th><th>Segment</th>
                      {stops.map(s=><th key={s.id}>{s.icon} {s.name.split(" ")[0]}</th>)}
                      <th>Total</th>
                    </tr></thead>
                    <tbody>
                      {kids.filter(k=>segF==="ALL"||k.segment===segF).map(kid=>{
                        const cnt=stops.filter(s=>att[kid.id]?.has(s.id)).length;
                        return (
                          <tr key={kid.id}>
                            <td><code style={{fontSize:".76rem"}}>{kid.id}</code></td>
                            <td style={{fontWeight:700}}>{kid.name}</td>
                            <td><span className={`stag st-${kid.segment.toLowerCase()}`}>{kid.segment}</span></td>
                            {stops.map(s=><td key={s.id} style={{textAlign:"center"}}>{att[kid.id]?.has(s.id)?"✅":"⬜"}</td>)}
                            <td><span style={{fontWeight:900,fontSize:".86rem",color:cnt===stops.length?"var(--gr)":cnt>0?"var(--am)":"var(--rd)"}}>{cnt}/{stops.length}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* ═══ QR CARDS ═══ */}
        {tab==="qr"&&(
          <>
            <div className="stl">🪪 QR ID Cards — Print &amp; Distribute</div>
            <p style={{fontSize:".86rem",color:"var(--mt)",marginBottom:16}}>Print these cards and give one to each participant. Volunteers enter the ID at each stop to mark attendance.</p>
            <div style={{display:"flex",gap:9,flexWrap:"wrap",alignItems:"center",marginBottom:18}}>
              <div className="seg-row" style={{marginBottom:0}}>
                {[["ALL","sb-all","🌐 All"],["BALAK","sb-bl","🧒 Balak"],["YUVAK","sb-yu","👦 Yuvak"]].map(([v,c,l])=>(
                  <button key={v} className={`sbtn ${c} ${segF===v?"on":""}`} onClick={()=>setSegF(v)}>{l}</button>
                ))}
              </div>
              {kids.length>0&&(
                <button className="btn bp" onClick={downloadPDF} disabled={pdfLoading}
                  style={{marginLeft:"auto",opacity:pdfLoading?.6:1}}>
                  {pdfLoading ? "⏳ Generating..." : "⬇️ Download PDF"}
                </button>
              )}
            </div>
            {kids.length===0?(
              <div className="empty"><div className="em-ic">🪪</div><div className="em-t">No kids yet</div><div className="em-s">Add kids in Setup tab</div></div>
            ):(
              <div className="qrg">
                {kids.filter(k=>segF==="ALL"||k.segment===segF).map(kid=>(
                  <div key={kid.id} className="qrc">
                    <div className={`qrc-hdr qh-${kid.segment.toLowerCase()}`}>
                      <span>🛕 BAPS CHIKHODARA</span>
                      <span style={{background:"rgba(255,255,255,.15)",padding:"2px 7px",borderRadius:10,fontSize:".6rem"}}>{kid.segment}</span>
                    </div>
                    <div className="qrc-body">
                      <div className={`av av-${kid.segment.toLowerCase()}`} style={{width:48,height:48,fontSize:"1rem",margin:"0 auto 9px"}}>{initials(kid.name)}</div>
                      <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:900,fontSize:".92rem",marginBottom:2}}>{kid.name}</div>
                      <div style={{fontSize:".7rem",color:"var(--mt)",marginBottom:11}}>{kid.segment}</div>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:9}}>
                        <QRCode value={kid.id} size={105} color={kid.segment==="BALAK"?"#1e40af":"#6d28d9"}/>
                      </div>
                      <div style={{fontFamily:"monospace",fontSize:".88rem",fontWeight:900,background:kid.segment==="BALAK"?"var(--bls)":"var(--yus)",borderRadius:8,padding:"5px 0",color:kid.segment==="BALAK"?"var(--bl)":"var(--yu)",letterSpacing:".1em"}}>
                        {kid.id}
                      </div>
                      {kid.phone&&<div style={{fontSize:".65rem",color:"var(--mt)",marginTop:5}}>📞 {kid.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Kid modal */}
      {selKid&&(
        <div className="mo" onClick={()=>setSelKid(null)}>
          <div className="md" onClick={e=>e.stopPropagation()}>
            <div className={`md-av av-${selKid.segment.toLowerCase()}`}>{initials(selKid.name)}</div>
            <div className="md-n">{selKid.name}</div>
            <div className="md-m">
              <span className={`stag st-${selKid.segment.toLowerCase()}`}>{selKid.segment}</span>
              {selKid.phone?` · 📞 ${selKid.phone}`:""}
            </div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:13}}>
              <QRCode value={selKid.id} size={135} color={selKid.segment==="BALAK"?"#1e40af":"#6d28d9"}/>
            </div>
            <div style={{textAlign:"center",fontFamily:"monospace",fontWeight:800,background:selKid.segment==="BALAK"?"var(--bls)":"var(--yus)",borderRadius:8,padding:"5px",marginBottom:14,color:selKid.segment==="BALAK"?"var(--bl)":"var(--yu)",fontSize:".88rem",letterSpacing:".1em"}}>
              {selKid.id}
            </div>
            {stops.length>0&&(
              <div className="mdstops">
                {stops.map(s=>(
                  <div key={s.id} className={`mds ${att[selKid.id]?.has(s.id)?"mds-ok":"mds-no"}`}>{s.icon} {s.name.split(" ")[0]}</div>
                ))}
              </div>
            )}
            {activeStop&&!present(selKid.id)&&(
              <button className="btn bp bfw" style={{marginBottom:8}} onClick={()=>{mark(selKid.id);setSelKid(null);}}>✅ Mark Present Now</button>
            )}
            <button className="btn bg bfw" onClick={()=>setSelKid(null)}>Close</button>
          </div>
        </div>
      )}

      <footer style={{textAlign:"center",padding:"16px",fontSize:".73rem",color:"var(--mt)",borderTop:"1px solid var(--bdr)",background:"#fff",marginTop:36}}>
        🛕 BAPS Chikhodara Mandal · Kids Trip QR Attendance · Jai Swaminarayan 🙏
      </footer>
    </>
  );
}