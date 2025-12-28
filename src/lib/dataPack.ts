import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dataPackCache: any = null;

// Server-side function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadDataPack(): any {
  if (dataPackCache) {
    return dataPackCache;
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'leaders-2025.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    dataPackCache = JSON.parse(fileContents);
    return dataPackCache;
  } catch (error) {
    console.error('Error loading data pack:', error);
    return {};
  }
}

// Client-side function (for Vision2026Screen and similar)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadDataPackClient(): any {
  // For client-side, we'll use a static import or API call
  // This is a placeholder that returns the vision data
  return {
    vision_2026: {
      intro: 'ב-2026 LEADERS פועלת כארגון מבוסס AI מקצה לקצה.',
      bullets: [],
      targets: []
    }
  };
}
