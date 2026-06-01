#!/bin/bash
# TAR01 — galerija 4 frame iz vsakega videa
#   frame #1 = naslovna @2s → BASE.jpg
#   frame #2-4 = galerija (25/50/75%) → BASE_2/3/4.jpg
#   vpiše img + gallery v content.js
# UPORABA: cd ~/Documents/Lek/tar01 && bash tar01_thumbs.sh
set -u; HERE="$(pwd)"
command -v ffmpeg  >/dev/null 2>&1 || { echo "❌ ffmpeg ni nameščen: brew install ffmpeg"; exit 1; }
command -v ffprobe >/dev/null 2>&1 || { echo "❌ ffprobe manjka."; exit 1; }
mkdir -p "$HERE/img"
echo "📺 TAR01 galerija sličic..."; OK=0

grab(){ ffmpeg -y -loglevel error -ss "$2" -i "$1" -frames:v 1 -vf "scale=600:-1" "$3" 2>/dev/null; [ -s "$3" ]; }

for V in "$HERE/video"/*.mp4; do
  [ -e "$V" ] || continue
  BASE="$(basename "$V" .mp4)"
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V" 2>/dev/null | cut -d. -f1)
  [ -z "$DUR" ] && DUR=8; [ "$DUR" -lt 3 ] && DUR=3
  T1=2
  T2=$(( DUR * 25 / 100 )); [ "$T2" -lt 1 ] && T2=1
  T3=$(( DUR * 50 / 100 )); [ "$T3" -lt 1 ] && T3=1
  T4=$(( DUR * 75 / 100 )); [ "$T4" -lt 1 ] && T4=1
  # če je video krajši od 2s, naslovno vzemi @0.5
  [ "$DUR" -lt 2 ] && T1="0.5"
  n=0
  grab "$V" "$T1" "$HERE/img/$BASE.jpg"     && n=$((n+1))
  grab "$V" "$T2" "$HERE/img/${BASE}_2.jpg" && n=$((n+1))
  grab "$V" "$T3" "$HERE/img/${BASE}_3.jpg" && n=$((n+1))
  grab "$V" "$T4" "$HERE/img/${BASE}_4.jpg" && n=$((n+1))
  if [ "$n" -ge 1 ]; then
    echo "  ✅ $BASE ($n sličic, ${DUR}s)"; OK=$((OK+1))
    python3 - "$HERE/content.js" "$BASE" "$HERE/img" <<'PY'
import sys,re,os
cjs,base,idir=sys.argv[1],sys.argv[2],sys.argv[3]
txt=open(cjs,encoding="utf-8").read(); vid=base+".mp4"
gal=[base+".jpg"]
for s in("_2","_3","_4"):
    if os.path.exists(os.path.join(idir,base+s+".jpg")): gal.append(base+s+".jpg")
gjs="["+", ".join('"'+g+'"' for g in gal)+"]"
pat=re.compile(r'(\{n:\d+,.*?video:\s*"'+re.escape(vid)+r'",)([^}]*?)(\})',re.S)
def fix(m):
    head,body,tail=m.group(1),m.group(2),m.group(3)
    # img
    if re.search(r'img:""',body): body=re.sub(r'img:""','img:"'+base+'.jpg"',body,1)
    elif 'img:' not in body: head=head+' img:"'+base+'.jpg",'
    # gallery
    if re.search(r'gallery:\s*\[[^\]]*\]',body): body=re.sub(r'gallery:\s*\[[^\]]*\]','gallery:'+gjs,body,1)
    else: body=' gallery:'+gjs+','+body
    return head+body+tail
new=pat.sub(fix,txt)
if new!=txt: open(cjs,"w",encoding="utf-8").write(new)
PY
  else echo "  ⚠️  $BASE"; fi
done
echo "✅ Obdelanih: $OK"
echo "▶️  TEST: cd .. && python3 -m http.server 8080 → http://localhost:8080/tar01/"
