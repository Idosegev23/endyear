#!/bin/bash

# סקריפט לדחיסת סרטונים גדולים
# משתמש ב-FFmpeg לדחיסה ל-H.264 עם איכות טובה

echo "מתחיל דחיסת סרטונים גדולים..."

# תיקיית פלט
mkdir -p public/vids/colgate/compressed
mkdir -p public/vids/xpeng/compressed

# קבצים לדחיסה
FILES=(
    "public/vids/colgate/Reel 1 Total Summer X Simpler(1).mp4"
    "public/vids/colgate/Reel 2 Total Summer X Simpler.mp4"
    "public/vids/colgate/Reel 3 Total Summer X Simpler(3).mp4"
    "public/vids/xpeng/Master Xpeng Asi 51sec.mp4"
    "public/vids/xpeng/Master Xpeng Manor 40sec.mp4"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        # שם הקובץ בלבד
        filename=$(basename "$file")
        # תיקייה
        dir=$(dirname "$file")
        # קובץ פלט
        output="${dir}/${filename%.*}_compressed.mp4"
        
        echo "מדחיס: $file"
        echo "פלט: $output"
        
        # דחיסה עם FFmpeg
        # CRF 28 = איכות בינונית-טובה, גודל קטן יותר
        # preset: fast = מהירות סבירה
        # scale: שומר על רזולוציה מקורית אבל מוריד ל-720p אם גדול יותר
        ffmpeg -i "$file" \
            -c:v libx264 \
            -crf 28 \
            -preset fast \
            -vf "scale='min(1280,iw)':'-2'" \
            -c:a aac \
            -b:a 128k \
            -movflags +faststart \
            -y \
            "$output"
        
        if [ $? -eq 0 ]; then
            # גודל קובץ מקורי
            original_size=$(du -h "$file" | cut -f1)
            # גודל קובץ דחוס
            compressed_size=$(du -h "$output" | cut -f1)
            echo "הצלחה! $original_size -> $compressed_size"
            
            # מחליף את הקובץ המקורי
            mv "$output" "$file"
            echo "הוחלף: $file"
        else
            echo "שגיאה בדחיסת $file"
        fi
        
        echo "---"
    else
        echo "קובץ לא נמצא: $file"
    fi
done

echo "דחיסה הסתיימה!"
echo ""
echo "גדלים חדשים:"
du -h "public/vids/colgate/Reel"* 2>/dev/null
du -h "public/vids/xpeng/Master"* 2>/dev/null



