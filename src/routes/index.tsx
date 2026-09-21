import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CalendarPlus, ChevronUp, Heart, MapPin, Maximize2, Music2, Navigation, Pause, Phone, Share2, Sparkles, X } from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import img1 from "@/assets/TVT00967.JPG";
import img2 from "@/assets/TVT00864.JPG";
import img3 from "@/assets/TVT01258.JPG";
import img4 from "@/assets/TVT01234.JPG";
import img5 from "@/assets/TVT01222.JPG";
import img6 from "@/assets/TVT01187.JPG";
import img7 from "@/assets/TVT01136.JPG";
import img8 from "@/assets/TVT01066.JPG";
import img9 from "@/assets/TVT01057.JPG";
import n1 from "@/assets/TVT00593.JPG.asset.json";
import n2 from "@/assets/TVT00610.JPG.asset.json";
import n3 from "@/assets/TVT00661.JPG.asset.json";
import n4 from "@/assets/TVT00690.JPG.asset.json";
import n5 from "@/assets/TVT00701.JPG.asset.json";
import n6 from "@/assets/TVT00726.JPG.asset.json";
import n7 from "@/assets/TVT00743.JPG.asset.json";
import n8 from "@/assets/TVT00744.JPG.asset.json";
import n9 from "@/assets/TVT00792.JPG.asset.json";
import n10 from "@/assets/TVT00576.JPG.asset.json";
import music from "@/assets/leDuong.mp3";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Thiệp cưới Thảo My & Xuân Tú — 03.10.2026" },
    { name: "description", content: "Cùng Thảo My và Xuân Tú đếm ngược đến ngày chúng mình trở thành gia đình." },
    { property: "og:title", content: "Thảo My & Xuân Tú — Save the date" },
    { property: "og:description", content: "Hai con người. Hai hành trình. Một đích đến — 03.10.2026" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: WeddingInvitation,
});

const photos = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const newPhotos = [n1.url, n2.url, n3.url, n4.url, n5.url, n6.url, n7.url, n8.url, n9.url, n10.url];
const gallery = [...photos.slice(2), ...newPhotos];
const strip = [n1.url, n4.url, n5.url, n6.url, n8.url, n9.url, n2.url, n3.url];
const weddingDate = new Date("2026-10-03T10:00:00+07:00").getTime();

function IconButton({ label, onClick, children, className = "" }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-secondary ${className}`}>{children}</button>;
}

function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [qr, setQr] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishes, setWishes] = useState<Array<{ id: string; guest_name: string; message: string }>>([]);
  const [wishStatus, setWishStatus] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const update = () => {
      const distance = Math.max(0, weddingDate - Date.now());
      setCountdown({ days: Math.floor(distance / 86400000), hours: Math.floor(distance / 3600000) % 24, minutes: Math.floor(distance / 60000) % 60, seconds: Math.floor(distance / 1000) % 60 });
    };
    update();
    const timer = window.setInterval(update, 1000);
    const onScroll = () => setProgress(Math.min(100, (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100));
    window.addEventListener("scroll", onScroll, { passive: true });
    QRCode.toDataURL(window.location.href, { width: 220, margin: 1, color: { dark: "#2f4453", light: "#fffdf9" } }).then(setQr).catch(() => setQr(""));
    supabase.from("wedding_wishes").select("id,guest_name,message").order("created_at", { ascending: false }).limit(20).then(({ data }) => setWishes(data ?? []));
    return () => { window.clearInterval(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  const calendarUrl = useMemo(() => {
    const details = encodeURIComponent("Lễ thành hôn Thảo My & Xuân Tú tại tư gia nhà trai, Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên.");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Lễ thành hôn Thảo My & Xuân Tú")}&dates=20261003T030000Z/20261003T050000Z&details=${details}`;
  }, []);

  async function enterInvitation() {
    setOpened(true);
    try { await audioRef.current?.play(); setPlaying(true); } catch { setPlaying(false); }
  }
  async function toggleMusic() {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause(); else await audioRef.current.play();
    setPlaying(!playing);
  }
  async function share() {
    const data = { title: "Thiệp cưới Thảo My & Xuân Tú", text: "03.10.2026 — Hẹn gặp bạn trong ngày vui của chúng mình!", url: window.location.href };
    if (navigator.share) await navigator.share(data).catch(() => undefined);
    else { await navigator.clipboard.writeText(window.location.href); window.alert("Đã sao chép đường dẫn thiệp."); }
  }
  function addAppleCalendar() {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "DTSTART:20261003T030000Z", "DTEND:20261003T050000Z", "SUMMARY:Lễ thành hôn Thảo My & Xuân Tú", "LOCATION:Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "thao-my-xuan-tu.ics"; a.click(); URL.revokeObjectURL(a.href);
  }
  async function submitWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setWishStatus("Đang gửi...");
    const formElement = event.currentTarget;
    const form = new FormData(formElement); const guest_name = String(form.get("wishName") ?? ""); const message = String(form.get("message") ?? "");
    const { data, error } = await supabase.from("wedding_wishes").insert({ guest_name, message }).select("id,guest_name,message").single();
    if (error) setWishStatus(error.message); else if (data) { setWishes((current) => [data, ...current]); setWishStatus("Lời chúc đã được gửi đến hai chúng mình."); formElement.reset(); }
  }

  return <main className="paper-texture min-h-screen text-foreground">
    <audio ref={audioRef} src={music} loop preload="auto" />
    {!opened && <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-sky-soft px-6">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-secondary/40 [clip-path:polygon(0_35%,50%_0,100%_35%,100%_100%,0_100%)]" />
      <button type="button" onClick={enterInvitation} className="reveal-up relative grid aspect-[1.45] w-full max-w-sm place-items-center overflow-hidden rounded-md border border-primary/25 bg-card film-shadow transition hover:scale-[1.02]">
        <span className="absolute inset-x-0 top-0 h-1/2 origin-top bg-primary/15 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        <span className="z-10 grid h-20 w-20 place-items-center rounded-full bg-secondary font-display text-2xl italic text-secondary-foreground shadow-lg">M · T</span>
        <span className="absolute bottom-6 text-xs uppercase text-muted-foreground">Chạm để mở thiệp</span>
      </button>
    </div>}
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-border no-print"><div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div>
    {[8, 29, 53, 76, 91].map((left, i) => <i key={left} className="petal" style={{ left: `${left}%`, animationDelay: `${i * 2.4}s` }} />)}
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2 no-print">
      <IconButton label={playing ? "Tạm dừng nhạc" : "Phát nhạc"} onClick={toggleMusic}>{playing ? <Pause size={18} /> : <Music2 size={18} />}</IconButton>
      <IconButton label="Chia sẻ thiệp" onClick={share}><Share2 size={18} /></IconButton>
      {progress > 18 && <IconButton label="Lên đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ChevronUp size={19} /></IconButton>}
    </div>

    <section id="home" className="relative min-h-[92svh] overflow-hidden bg-foreground">
      <img src={img1} alt="Thảo My và Xuân Tú" className="absolute inset-0 h-full w-full object-cover object-[48%_35%] opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-transparent to-foreground/80" />
      <div className="relative mx-auto flex min-h-[92svh] max-w-5xl flex-col items-center justify-end px-5 pb-16 text-center text-primary-foreground">
        <p className="mb-5 text-xs uppercase tracking-[.28em]">Save the date · 03.10.2026</p>
        <h1 className="text-6xl leading-[.88] sm:text-8xl">Thảo My<br/><span className="text-secondary">&</span> Xuân Tú</h1>
        <p className="mt-6 max-w-md text-sm font-light leading-7">Hai con người… Hai hành trình… Một đích đến.</p>
        <a href="#invitation" className="mt-8 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[.22em]">Mở chương đầu <span className="h-10 w-px bg-primary-foreground/60" /></a>
      </div>
    </section>

    <section id="invitation" className="mx-auto grid max-w-5xl gap-10 px-6 py-24 md:grid-cols-[.8fr_1.2fr] md:items-center">
      <div><p className="text-xs uppercase tracking-[.24em] text-primary">Chương I · Lời mời</p><h2 className="mt-4 text-5xl leading-tight">Ngày chúng mình gọi nhau là gia đình</h2><p className="mt-6 max-w-md leading-8 text-muted-foreground">Một chương mới sắp bắt đầu. Sẽ thật trọn vẹn nếu trong ngày vui ấy, chúng mình được nhìn thấy nụ cười của bạn — người đã yêu thương và đồng hành cùng hai đứa.</p></div>
      <button type="button" onClick={() => setLightbox(img2)} className="relative ml-auto w-[88%] overflow-hidden rounded-sm film-shadow md:w-full"><img src={img2} alt="Ảnh cưới của Thảo My và Xuân Tú" className="aspect-[3/4] w-full object-cover"/><Maximize2 className="absolute bottom-4 right-4 text-primary-foreground" size={20}/></button>
    </section>

    <section className="bg-foreground px-5 py-24 text-primary-foreground">
      <div className="mx-auto max-w-4xl text-center"><p className="text-xs uppercase tracking-[.22em] text-secondary">03 tháng 10 năm 2026</p><h2 className="mt-4 text-4xl">Đến khoảnh khắc chúng mình trở thành gia đình</h2>
        <div className="mt-12 grid grid-cols-4 gap-2">{Object.entries(countdown).map(([label, value]) => <div key={label} className="border-y border-primary-foreground/20 py-5"><strong className="block font-display text-3xl sm:text-5xl">{String(value).padStart(2,"0")}</strong><span className="mt-2 block text-[9px] uppercase tracking-[.16em] text-primary-foreground/65">{{days:"Ngày",hours:"Giờ",minutes:"Phút",seconds:"Giây"}[label as keyof typeof countdown]}</span></div>)}</div>
      </div>
    </section>

    <section id="story" className="mx-auto max-w-4xl px-6 py-24"><p className="text-xs uppercase tracking-[.24em] text-primary">Chương II · Chuyện chúng mình</p><h2 className="mt-4 text-5xl">Từ hai câu chuyện,<br/>thành một hành trình</h2>
      <div className="relative mt-16 border-l border-primary/35 pl-8 md:ml-24">{[
        ["01", "Ngày mình gặp nhau", "Giữa rất nhiều người, chúng mình đã nhận ra một ánh mắt muốn nhớ thật lâu."],
        ["02", "Ngày thương gọi thành tên", "Những câu chuyện không đầu không cuối dần trở thành điều mong đợi nhất mỗi ngày."],
        ["03", "Lời hứa cho mai sau", "Không cần một khoảnh khắc hoàn hảo — chỉ cần đúng người và một câu đồng ý."],
        ["04", "Ngày về chung một nhà", "03.10.2026, chương đẹp nhất được viết tiếp với gia đình và những người chúng mình yêu quý."],
      ].map(([n,title,text], i) => <article key={n} className={`relative mb-16 max-w-xl ${i % 2 ? "md:ml-28" : ""}`}><span className="absolute -left-[45px] top-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{n}</span><h3 className="text-3xl">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></article>)}</div>
    </section>

    <section id="gallery" className="bg-sky-soft px-3 py-24"><div className="mx-auto max-w-6xl"><div className="px-3 text-center"><p className="text-xs uppercase tracking-[.24em] text-primary">Chương III · Những thước phim</p><h2 className="mt-4 text-5xl">Một đời, thật nhiều dịu dàng</h2></div>
      <div className="mt-12 columns-2 gap-3 md:columns-3">{photos.slice(2).map((src,i) => <button type="button" key={src} onClick={() => setLightbox(src)} className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-sm"><img src={src} alt={`Khoảnh khắc cưới ${i+1}`} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${i === 0 || i === 4 ? "aspect-[3/4]" : "aspect-[4/5]"}`}/><span className="absolute inset-0 grid place-items-center bg-foreground/0 text-primary-foreground opacity-0 transition group-hover:bg-foreground/15 group-hover:opacity-100"><Maximize2 size={24}/></span></button>)}</div></div>
    </section>

    <section id="date" className="mx-auto max-w-5xl px-6 py-24"><div className="grid gap-12 md:grid-cols-2"><div><p className="text-xs uppercase tracking-[.24em] text-primary">Chương IV · Hẹn ngày</p><h2 className="mt-4 text-5xl">Tháng Mười<br/>mình có hẹn</h2><p className="mt-6 text-muted-foreground">Dự báo thời tiết sẽ được cập nhật khi gần tới ngày cưới.</p></div><Calendar /></div>
      <div className="mt-20 grid gap-5 md:grid-cols-2"><EventCard label="Tiệc mừng nhà gái" time="18:00 · Thứ Sáu" date="02.10.2026" lunar="22 tháng 08 năm Bính Ngọ" address="Cuối nhà thờ Cát Phú, Thôn Phú Bình, Xã Xuân Giang, Tỉnh Ninh Bình"/><EventCard label="Lễ thành hôn nhà trai" time="10:00 · Thứ Bảy" date="03.10.2026" lunar="23 tháng 08 năm Bính Ngọ" address="Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên"/></div>
    </section>

    <section className="bg-secondary/35 px-6 py-24"><div className="mx-auto max-w-5xl"><div className="text-center"><p className="text-xs uppercase tracking-[.24em] text-primary">Hai nơi yêu thương</p><h2 className="mt-4 text-5xl">Hai gia đình</h2></div><div className="mt-12 grid gap-5 md:grid-cols-2"><FamilyCard side="Nhà gái" father="Ông Tống Văn Chức" mother="Bà Phạm Thị Ngân" address="Thôn Phú Bình, Xã Xuân Giang, Tỉnh Ninh Bình" query="Cuối nhà thờ Cát Phú, Xuân Giang, Ninh Bình"/><FamilyCard side="Nhà trai" father="Ông Trần Xuân Sinh" mother="Bà Phạm Thị Kim Thủy" address="Chợ Gồ, Thôn Thanh Cù, Xã Hiệp Cường, Tỉnh Hưng Yên" query="Chợ Gồ, Hiệp Cường, Hưng Yên"/></div></div></section>

    <section id="schedule" className="mx-auto max-w-4xl px-6 py-24"><p className="text-xs uppercase tracking-[.24em] text-primary">Chương V · Chương trình</p><h2 className="mt-4 text-5xl">Hai ngày vui,<br/>một lời hẹn</h2><div className="mt-14 space-y-0"><Schedule time="18:00 · 02.10" title="Tiệc mừng tại nhà gái" place="Tư gia nhà gái · Ninh Bình"/><Schedule time="10:00 · 03.10" title="Lễ thành hôn tại nhà trai" place="Tư gia nhà trai · Hưng Yên"/></div><div className="mt-10 flex flex-wrap gap-3"><a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"><CalendarPlus size={17}/> Google Calendar</a><button type="button" onClick={addAppleCalendar} className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary"><CalendarPlus size={17}/> Apple Calendar</button></div></section>


    <section id="wishes" className="mx-auto max-w-5xl px-6 py-24"><div className="text-center"><p className="text-xs uppercase tracking-[.24em] text-primary">Những điều thương mến</p><h2 className="mt-4 text-5xl">Gửi một lời chúc</h2></div><form onSubmit={submitWish} className="mx-auto mt-10 grid max-w-xl gap-3"><Field name="wishName" label="Tên của bạn" required light/><label className="grid gap-2 text-sm">Lời chúc<textarea required name="message" maxLength={500} rows={3} className="rounded-sm border border-border bg-card p-4"/></label><button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground"><Heart size={17}/> Gửi lời chúc</button>{wishStatus && <p role="status" className="text-center text-sm text-primary">{wishStatus}</p>}</form><div className="mx-auto mt-12 grid max-w-2xl gap-3">{wishes.length ? wishes.map(w=><div key={w.id} className="grid grid-cols-[auto_1fr_auto] gap-3 rounded-sm border border-border bg-card p-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-display text-lg text-secondary-foreground">{w.guest_name.charAt(0).toUpperCase()}</div><div className="min-w-0"><strong className="text-sm">{w.guest_name}</strong><p className="mt-1 text-sm leading-6 text-muted-foreground">{w.message}</p></div><Heart size={16} className="mt-1 text-accent"/></div>) : <p className="text-center text-sm text-muted-foreground">Hãy là người đầu tiên gửi lời chúc đến hai chúng mình.</p>}</div></section>

    <section className="relative min-h-[82svh] overflow-hidden bg-foreground"><img src={img9} alt="Thảo My và Xuân Tú dưới tấm voan cưới" className="absolute inset-0 h-full w-full object-cover opacity-60"/><div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent"/><div className="relative mx-auto flex min-h-[82svh] max-w-xl flex-col items-center justify-end px-6 pb-20 text-center text-primary-foreground"><Sparkles className="mb-5 text-secondary"/><p className="leading-7 text-primary-foreground/75">Cảm ơn bạn đã đi qua từng trang nhỏ trong câu chuyện của chúng mình. Hẹn gặp nhau, cùng cười thật nhiều và lưu lại một ngày không thể nào quên.</p><h2 className="mt-8 text-5xl">The End</h2><p className="mt-2 text-xs uppercase tracking-[.28em] text-secondary">See you there</p><div className="mt-10 flex items-center gap-4">{qr && <img src={qr} alt="Mã QR thiệp cưới" className="h-24 w-24 rounded-sm"/>}<div className="text-left text-xs leading-6 text-primary-foreground/65">Thảo My & Xuân Tú<br/>03 · 10 · 2026</div></div></div></section>

    {lightbox && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-foreground/95 p-3" onClick={() => setLightbox(null)}><IconButton label="Đóng ảnh" onClick={() => setLightbox(null)} className="absolute right-4 top-4"><X size={20}/></IconButton><img src={lightbox} alt="Ảnh cưới phóng to" className="max-h-[92vh] max-w-full object-contain" onClick={e=>e.stopPropagation()}/></div>}
  </main>;
}

function Calendar() {
  const days = ["T2","T3","T4","T5","T6","T7","CN"];
  return <div className="rounded-sm border border-border bg-card p-5 film-shadow"><div className="flex items-center justify-between border-b border-border pb-4"><span className="font-display text-2xl">October</span><span className="text-sm text-muted-foreground">2026</span></div><div className="mt-4 grid grid-cols-7 gap-1 text-center">{days.map(d=><span key={d} className="py-2 text-[10px] uppercase text-muted-foreground">{d}</span>)}{[...Array(3)].map((_,i)=><span key={`blank-${i}`}/>)}{[...Array(31)].map((_,i)=>{const n=i+1;return <span key={n} className={`relative grid aspect-square place-items-center text-sm ${n===3 ? "rounded-full bg-secondary font-semibold text-secondary-foreground" : ""}`}>{n}{n===3&&<Heart size={12} fill="currentColor" className="absolute -top-1 -right-0"/>}</span>})}</div></div>;
}

function EventCard({ label,time,date,lunar,address }: { label:string;time:string;date:string;lunar:string;address:string }) {
  return <article className="rounded-sm border border-border bg-card p-6"><p className="text-xs uppercase tracking-[.18em] text-primary">{label}</p><h3 className="mt-4 text-3xl">{time}</h3><p className="mt-1 font-medium">{date}</p><p className="mt-1 text-sm text-muted-foreground">Âm lịch · {lunar}</p><div className="mt-6 flex gap-3 border-t border-border pt-5 text-sm leading-6 text-muted-foreground"><MapPin size={18} className="mt-1 shrink-0 text-accent"/>{address}</div></article>;
}
function FamilyCard({side,father,mother,address,query}:{side:string;father:string;mother:string;address:string;query:string}) {
  return <article className="rounded-sm border border-border bg-card p-7 text-center"><p className="text-xs uppercase tracking-[.2em] text-primary">{side}</p><h3 className="mt-5 text-2xl">{father}<br/>{mother}</h3><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{address}</p><div className="mt-6 flex justify-center gap-3"><a title="Mở Google Maps" aria-label={`Chỉ đường đến ${side}`} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Navigation size={18}/></a><a title="Mở Apple Maps" aria-label={`Mở Apple Maps đến ${side}`} href={`https://maps.apple.com/?q=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-primary text-primary"><MapPin size={18}/></a><span title="Số điện thoại sẽ được cập nhật" aria-label="Số điện thoại chưa cập nhật" className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground"><Phone size={18}/></span></div></article>;
}
function Schedule({time,title,place}:{time:string;title:string;place:string}) { return <div className="grid grid-cols-[6rem_1fr] gap-5 border-t border-border py-7 first:border-t-0 sm:grid-cols-[9rem_1fr]"><span className="text-sm font-medium text-primary">{time}</span><div><h3 className="text-2xl">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{place}</p></div></div>; }
function Field({name,label,required,inputMode,light}:{name:string;label:string;required?:boolean;inputMode?:"tel";light?:boolean}) { return <label className="grid gap-2 text-sm">{label}<input name={name} required={required} inputMode={inputMode} maxLength={100} className={`h-12 rounded-sm border px-4 ${light ? "border-border bg-card" : "border-primary-foreground/20 bg-primary-foreground/5"}`}/></label>; }
