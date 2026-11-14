# Dyplom, Terenowa 5, Bieg dla Ady

Statyczna strona: wpisujesz imię i nazwisko, wybierasz bieg i pobierasz dyplom A4 w PDF.
Wszystko działa w przeglądarce, bez serwera i bez zbierania danych.

## Wdrożenie na Vercel

Najszybciej z terminala, w tym folderze:

```
npx vercel --prod
```

Przy pytaniach wybierz: framework `Other`, build command pusty, output directory `.` (domyślny).

Albo przez GitHub: wrzuć folder do repozytorium, w Vercel wybierz Add New, Project, Import.
Preset `Other`, bez komendy budowania.

## Pliki

- `index.html`, `styles.css`, `app.js`: strona i logika
- `assets/pieczec-odwrotne.svg`: pieczęć na zielonym panelu dyplomu
- `assets/pieczec-kolor.svg`: favicon strony
- `sponsorzy/`: tu wrzucasz logo sponsorów, instrukcja w `sponsorzy/README.md`
- `fonts/`: Barlow i Barlow Condensed z polskimi znakami
- `vendor/`: html2canvas i jsPDF (lokalnie, bez CDN)

## Skróty

- Enter w polu imienia pobiera PDF, potem pole się czyści dla kolejnej osoby.
- Link z gotowymi danymi: `/?imie=Anna%20Kowalska&bieg=dzieci`
- Przycisk Drukuj drukuje dyplom na A4 w poziomie (lub zapis jako PDF w wektorze).

Teksty dyplomu zmienisz w `app.js`, w obiekcie `BIEGI`.
