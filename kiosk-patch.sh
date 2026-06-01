#!/bin/bash
# Po `cap sync android` nastavi kiosk lastnosti:
#  - PORTRAIT lock (13" tablet pokončno!)
#  - fullscreen (skrije status + navigation bar)
#  - screen always on (muzej — nikoli ne ugasne)
# Patcha AndroidManifest.xml + MainActivity + styles.
set -e
MANIFEST="android/app/src/main/AndroidManifest.xml"
STYLES="android/app/src/main/res/values/styles.xml"

echo "🔒 Kiosk patch ..."

# 1) PORTRAIT + keepScreenOn na activity
if grep -q 'android:name=".MainActivity"' "$MANIFEST"; then
  # vstavi screenOrientation=portrait če ga še ni
  if ! grep -q 'screenOrientation' "$MANIFEST"; then
    sed -i 's#android:name=".MainActivity"#android:name=".MainActivity"\n            android:screenOrientation="portrait"#' "$MANIFEST"
    echo "  ✅ portrait lock dodan"
  fi
fi

# 2) Fullscreen tema (skrij status bar)
if [ -f "$STYLES" ]; then
  if ! grep -q 'windowFullscreen' "$STYLES"; then
    sed -i 's#</resources>#    <style name="AppTheme.Fullscreen" parent="AppTheme.NoActionBar">\n        <item name="android:windowFullscreen">true</item>\n        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>\n    </style>\n</resources>#' "$STYLES"
    echo "  ✅ fullscreen tema dodana"
  fi
fi

# 3) keepScreenOn + immersive v MainActivity
MAIN=$(find android/app/src/main/java -name "MainActivity.java" | head -1)
if [ -n "$MAIN" ] && ! grep -q "FLAG_KEEP_SCREEN_ON" "$MAIN"; then
  python3 - "$MAIN" <<'PY'
import sys,re
f=sys.argv[1]; t=open(f).read()
if "import android.view.WindowManager" not in t:
    t=t.replace("import com.getcapacitor.BridgeActivity;",
        "import com.getcapacitor.BridgeActivity;\nimport android.os.Bundle;\nimport android.view.WindowManager;\nimport android.view.View;")
inject='''
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }
'''
t=re.sub(r'(public class MainActivity extends BridgeActivity \{)', r'\1'+inject, t, count=1)
open(f,"w").write(t)
print("  ✅ keepScreenOn + immersive dodan v MainActivity")
PY
fi
echo "🔒 Kiosk patch končan."
