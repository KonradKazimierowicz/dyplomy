(() => {
  "use strict";

  const W = 1123, H = 794; // A4 w poziomie przy 96 dpi

  const BIEGI = {
    glowny: {
      klasa: "dyplom--glowny",
      kat: "Bieg główny",
      dystans: "około 5 km",
      tytul: "Dyplom",
      tekst: "za udział w Terenowej 5, Biegu dla Ady. Dziękujemy za każdy krok.",
      tasma: "#FF5A1F",   // szlak
      plik: "GLOWNY"
    },
    dzieci: {
      klasa: "dyplom--dzieci",
      kat: "Bieg dzieci",
      dystans: "do 500 m",
      tytul: "Brawo!",
      tekst: "za start w biegu dzieci na Terenowej 5. Każdy Twój krok liczył się dla Ady.",
      tasma: "#F2B21B",   // modrzew
      plik: "DZIECI"
    }
  };

  // Sponsorzy jak na plakacie A3: organizator, patronat, partnerzy.
  // Wrzuć oryginalne logo do folderu sponsorzy/ pod nazwą z pola "plik"
  // (rozszerzenie .png, .svg lub .jpg). Bez pliku pokazuje się sama nazwa.
  const SPONSORZY = [
    { grupa: "Organizator", h: 56, maxW: 150, logo: [
      { nazwa: "Fundacja Beyond Space", plik: "beyond-space" }
    ] },
    { grupa: "Patronat", h: 56, maxW: 120, opis: ["Prezydenta Miasta Głogowa", "Rafaela Rokaszewicza"], logo: [
      { nazwa: "Urząd Miasta Głogowa", plik: "urzad-miasta-glogowa" }
    ] },
    { grupa: "Partnerzy", h: 40, maxW: 112, logo: [
      { nazwa: "Lubinpex", plik: "lubinpex" },
      { nazwa: "KGHM Polska Miedź", plik: "kghm" },
      { nazwa: "Powiat Głogowski", plik: "powiat-glogowski" },
      { nazwa: "Lasy Państwowe", plik: "lasy-panstwowe" },
      { nazwa: "Automobilklub Głogów", plik: "automobilklub-glogow" },
      { nazwa: "Akademia Sportów Obronnych", plik: "akademia-sportow-obronnych" },
      { nazwa: "KojotCar", plik: "kojotcar" },
      { nazwa: "Only Cars Studio", plik: "only-cars-studio" }
    ] }
  ];

  const $ = (id) => document.getElementById(id);
  const form = $("form"), input = $("name"), btnPdf = $("pdf"), btnPrint = $("print"), status = $("status");
  const dyplom = $("dyplom"), imie = $("imie"), imieTxt = $("imieTxt");
  const frame = $("frame"), scaleBox = $("scale");

  // Taśma trasy: ukośne pasy w kolorze biegu na brzozie, jako SVG (pewny render w PDF)
  function tasmaSrc(kolor) {
    const h = 28, pas = 20 * Math.SQRT2, okres = 2 * pas;
    let p = "";
    for (let x = -h - okres; x < W + okres; x += okres) {
      p += `<polygon points="${x},${h} ${x + h},0 ${x + h + pas},0 ${x + pas},${h}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}"><rect width="${W}" height="${h}" fill="#F6F1E4"/><g fill="${kolor}">${p}</g></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Pas sponsorów
  (function sponsorzy() {
    const box = $("sponsorzy");
    const ROZ = [".png", ".svg", ".jpg"];
    SPONSORZY.forEach((g) => {
      const grupa = document.createElement("div");
      grupa.className = "sponsorzy__grupa sponsorzy__grupa--" + g.grupa.toLowerCase();
      const lab = document.createElement("p");
      lab.className = "t5-l";
      lab.textContent = g.grupa;
      const row = document.createElement("div");
      row.className = "sponsorzy__logos";
      g.logo.forEach((s) => {
        const img = new Image();
        img.alt = s.nazwa;
        let i = 0;
        img.onload = () => {
          // Stała wysokość grupy, szerokość z proporcji logo, z limitem. Bez rozciągania.
          const r = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 2;
          let h = g.h, w = h * r;
          if (w > g.maxW) { w = g.maxW; h = w / r; }
          img.style.width = w + "px";
          img.style.height = h + "px";
        };
        img.onerror = () => {
          i++;
          if (i < ROZ.length) { img.src = "sponsorzy/" + s.plik + ROZ[i]; return; }
          const t = document.createElement("span");
          t.className = "sponsorzy__nazwa";
          t.textContent = s.nazwa;
          img.replaceWith(t);
        };
        img.src = "sponsorzy/" + s.plik + ROZ[0];
        row.appendChild(img);
      });
      if (g.opis) {
        const p = document.createElement("p");
        p.className = "sponsorzy__opis";
        g.opis.forEach((linia, k) => { if (k) p.appendChild(document.createElement("br")); p.appendChild(document.createTextNode(linia)); });
        row.appendChild(p);
      }
      grupa.append(lab, row);
      box.appendChild(grupa);
    });
  })();

  const bieg = () => form.querySelector("input[name=bieg]:checked").value;
  const czysteImie = () => input.value.replace(/\s+/g, " ").trim();

  function dopasujImie() {
    let size = 64;
    imieTxt.style.fontSize = size + "px";
    while (imieTxt.scrollWidth > imie.clientWidth && size > 32) {
      size -= 2;
      imieTxt.style.fontSize = size + "px";
    }
  }

  function render() {
    const b = BIEGI[bieg()];
    dyplom.classList.remove("dyplom--glowny", "dyplom--dzieci");
    dyplom.classList.add(b.klasa);
    $("kat").textContent = b.kat;
    $("dystans").textContent = b.dystans;
    $("tytul").textContent = b.tytul;
    $("tekst").textContent = b.tekst;
    $("tasma").src = tasmaSrc(b.tasma);

    const n = czysteImie();
    imieTxt.textContent = n || (bieg() === "dzieci" ? "Imię dziecka" : "Imię i nazwisko");
    imie.classList.toggle("is-empty", !n);
    btnPdf.disabled = btnPrint.disabled = !n;
    dopasujImie();
  }

  function skaluj() {
    scaleBox.style.transform = `scale(${frame.clientWidth / W})`;
  }

  function nazwaPliku() {
    const slug = czysteImie()
      .replace(/ł/g, "l").replace(/Ł/g, "L")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9 -]/g, "").trim().replace(/ +/g, "-");
    return `DYPLOM_${BIEGI[bieg()].plik}_${slug || "uczestnik"}_2026-11-14.pdf`;
  }

  // html2canvas nie rysuje pewnie plików SVG (pieczęć, logo partnerów),
  // więc na czas tworzenia PDF zamieniamy je na PNG w 3x. Pliki zostają bez zmian.
  const pngCache = {};
  function svgDoPng(url, w, h) {
    const key = url + "@" + w + "x" + h;
    if (pngCache[key]) return Promise.resolve(pngCache[key]);
    return new Promise((ok, fail) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = Math.round(w * 3); c.height = Math.round(h * 3);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        ok(pngCache[key] = c.toDataURL("image/png"));
      };
      img.onerror = fail;
      img.src = url;
    });
  }

  async function pobierzPdf() {
    if (!czysteImie()) { input.focus(); return; }
    btnPdf.disabled = true;
    const label = btnPdf.textContent;
    btnPdf.textContent = "Tworzę PDF";
    status.textContent = "Tworzę dyplom, to potrwa chwilę.";
    try {
      await document.fonts.ready;
      const imgs = [...dyplom.querySelectorAll("img")];
      const zamiany = await Promise.all(imgs.map((im) =>
        /\.svg($|\?)/i.test(im.getAttribute("src") || "")
          ? svgDoPng(im.src, im.offsetWidth, im.offsetHeight)
          : null));
      const canvas = await window.html2canvas(dyplom, {
        scale: 3,
        width: W, height: H,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          doc.getElementById("scale").style.transform = "none";
          doc.querySelectorAll("#dyplom img").forEach((im, i) => {
            if (zamiany[i]) {
              im.style.width = imgs[i].offsetWidth + "px";
              im.style.height = imgs[i].offsetHeight + "px";
              im.src = zamiany[i];
            }
          });
        }
      });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
      pdf.setProperties({ title: "Dyplom, Terenowa 5, Bieg dla Ady", author: "Fundacja Beyond Space" });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210);
      pdf.save(nazwaPliku());
      status.textContent = `Gotowe: ${czysteImie()}. Wpisz kolejną osobę.`;
      input.value = "";
      render();
      input.focus();
    } catch (e) {
      console.error(e);
      status.textContent = "Nie udało się utworzyć PDF. Spróbuj przycisku Drukuj i zapisz jako PDF.";
    } finally {
      btnPdf.textContent = label;
      btnPdf.disabled = !czysteImie();
    }
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); pobierzPdf(); });
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  btnPrint.addEventListener("click", () => { if (czysteImie()) window.print(); });
  window.addEventListener("resize", skaluj);

  // Opcjonalnie: ?imie=Anna%20Kowalska&bieg=dzieci wypełnia formularz
  const q = new URLSearchParams(location.search);
  if (q.get("imie")) input.value = q.get("imie").slice(0, 48);
  if (q.get("bieg") === "dzieci") form.querySelector("input[value=dzieci]").checked = true;

  skaluj();
  render();
  document.fonts.ready.then(dopasujImie);
  input.focus();
})();
