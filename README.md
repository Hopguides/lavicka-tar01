# 📱 TAR01 → Android APK (online build, brez Android Studia)

WebView APK za 13" tablet, **pokončno (portrait)**, fullscreen kiosk, videi offline v aplikaciji.

---

## 🟢 KORAKI (~15 min, vse v oblaku)

### 1) Daj videe + sličice noter
```bash
cd tar01-android
cp /pot/do/lek/tar01/video/*.mp4  www/video/
cp /pot/do/lek/tar01/img/*.jpg    www/img/    # če si pognal thumbs.sh
```
⚠️ **Brez tega bo APK prazen.** Videi MORAJO biti v `www/video/`.

Preveri:
```bash
ls www/video/*.mp4 | wc -l        # mora biti 23
grep -c "1_Brizga" www/content.js # mora biti 1 (pravi content)
```

### 2) Naredi GitHub repo + pushaj
```bash
git init && git add -A && git commit -m "TAR01 kiosk"
git branch -M main
git remote add origin https://github.com/TVOJ_USER/lavicka-tar01.git
git push -u origin main
```

### 3) Počakaj build (~5 min)
- Pojdi na GitHub → zavihek **Actions**
- Build se sproži sam ob push. Ko je ✅ zelen:
- Klikni run → spodaj **Artifacts** → prenesi **TAR01-Izjemni-predmeti-APK**

### 4) Namesti na tablet
- Razpakiraj zip → `app-debug.apk`
- Prenesi na tablet (USB / Drive / email), tapni, namesti
  (vklopi *Neznani viri* v nastavitvah, če vpraša)

---

## 🔒 KIOSK MODE na tabletu (po namestitvi)

APK ima že vgrajeno: **portrait lock, fullscreen, zaslon nikoli ne ugasne.**

Za pravi kiosk (obiskovalec ne more ven iz aplikacije) priporočam na tabletu:
- **Samsung Galaxy Tab Active** → vgrajen *Kiosk mode* v nastavitvah
- ali brezplačna app **Fully Kiosk Browser** kot launcher
- ali Android **Screen Pinning** (Nastavitve → Varnost → Pripni zaslon)

Teksel naj to nastavi ob montaži — del HW konfiguracije.

---

## 🔄 UPDATE kasneje
Zamenjaj vsebino v `www/`, `git commit + push` → nov APK iz Actions.
Brez Android Studia, brez tvojega računalnika za build.

## 📦 KAJ JE V PROJEKTU
- `www/` — tvoja postaja (index.html, app.js, content.js, video/, img/)
- `capacitor.config.json` — ime app, appId
- `.github/workflows/build.yml` — cloud build
- `kiosk-patch.sh` — portrait + fullscreen + screen-on (teče v buildu)

## 🚫 NE
- ne commitaj `node_modules/` ali `android/` (so v .gitignore — generira jih build)
- ne pozabi videov v `www/video/` pred pushem
