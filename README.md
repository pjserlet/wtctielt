# WTC Tielt — clubwebsite

Een statische website voor Wielertoeristenclub Tielt, gebouwd met enkel HTML, CSS en een paar regels JavaScript. Geen build-stap, geen frameworks — gewoon openen en deployen.

## Bestanden

```
index.html      Landing
about.html      Over ons / bestuur / tijdlijn
rides.html      Ritten, niveaus, weekschema
events.html     Evenementenkalender
gallery.html    Fotogalerij (placeholder gradients)
contact.html    Lid worden + contactformulier + FAQ
styles.css      Volledige styling
script.js       Mobiel menu + footer-jaar
```

## Lokaal bekijken

Dubbelklik gewoon op `index.html` in de map. Of, voor een propere localhost:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Open vervolgens http://localhost:8000.

## Deployen via GitHub Pages

GitHub Pages is gratis en perfect voor een statische clubsite. Hieronder twee manieren — kies wat je het makkelijkst vindt.

### Optie A — Via de GitHub-website (geen terminal nodig)

1. **Maak een GitHub-account** op https://github.com (gratis) als je er nog geen hebt.
2. Klik rechtsboven op **+ → New repository**.
3. Geef de repository de naam **`wtctielt.github.io`** (deze exacte naam zorgt ervoor dat je site automatisch op `https://wtctielt.github.io` verschijnt). Of kies een andere naam zoals `wtc-tielt-site` als je dat liever hebt.
4. Zet de repo op **Public** en klik op **Create repository**.
5. Klik op **uploading an existing file** (of de "Add file" → "Upload files" knop).
6. Sleep alle bestanden uit deze map (`index.html`, `about.html`, `rides.html`, `events.html`, `gallery.html`, `contact.html`, `styles.css`, `script.js`) in het venster.
7. Klik onderaan op **Commit changes**.
8. Ga in de repo naar **Settings → Pages** (links in het menu).
9. Onder **"Build and deployment"**:
   - Source: **Deploy from a branch**
   - Branch: **main** · folder: **/ (root)** → **Save**.
10. Wacht 30–60 seconden. Vernieuw de Pages-pagina — bovenaan staat dan: *Your site is live at …*. Klik op die URL.

Als je voor de naam `wtctielt.github.io` koos, is je site bereikbaar op: **https://wtctielt.github.io**
Als je een andere naam koos, dan op: **https://&lt;username&gt;.github.io/&lt;reponaam&gt;/**

### Optie B — Via de terminal (als je git geïnstalleerd hebt)

```bash
# 1. Maak op github.com een lege repo aan (zonder README/gitignore).
# 2. Open een terminal in deze map en voer uit:

git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<username>/<reponaam>.git
git push -u origin main

# 3. Activeer Pages: Settings → Pages → Source: Deploy from branch → main → /(root)
```

### Updates publiceren

Telkens je een bestand wijzigt:

- **Via website**: ga naar het bestand in de repo, klik op het potlood-icoon, bewerk, en commit.
- **Via terminal**: `git add . && git commit -m "Update" && git push`.

GitHub Pages herbouwt de site binnen 1 minuut.

## Eigen domein (optioneel)

Heb je een domein zoals `wtctielt.be`?

1. Bij je registrar (bv. Combell, OVH): zet een CNAME-record `www` → `<username>.github.io` en eventueel A-records voor de root naar GitHub's IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153).
2. In de repo: maak een bestand `CNAME` met daarin enkel `wtctielt.be`.
3. In **Settings → Pages → Custom domain** vul je `wtctielt.be` in. Vink **Enforce HTTPS** aan.

## Inhoud aanpassen

Alle teksten staan rechtstreeks in de HTML-bestanden — geen CMS nodig. Open het bestand in een teksteditor (bv. VS Code, Notepad++) en pas aan.

Voor echte foto's in de galerij: vervang in `gallery.html` de `<div class="g-img g-1"></div>` blokjes door `<img src="foto1.jpg" alt="..." />`, plaats de foto's in een `images/` map, en pas eventueel een klein stukje CSS aan zodat de afbeeldingen het hele blok vullen.

## Licentie

Vrij te gebruiken voor WTC Tielt. Stockfoto's en logo dien je nog zelf toe te voegen.
