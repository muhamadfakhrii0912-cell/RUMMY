import * as exifr from "exifr";

interface GpsData {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: Date;
}

interface ExifResult {
  gps: GpsData | null;
  hasGps: boolean;
  camera?: string;
  timestamp?: Date;
  rawMetadata: Record<string, unknown>;
}

/**
 * Parse EXIF data dari URL foto untuk ekstrak GPS coordinates
 */
export async function parseExifFromUrl(imageUrl: string): Promise<ExifResult> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    const exif = await exifr.parse(buffer, {
      gps: true,
      tiff: true,
      xmp: true,
      icc: false,
      jfif: false,
      ihdr: false,
    });

    if (!exif) {
      return { gps: null, hasGps: false, rawMetadata: {} };
    }

    const hasGps = !!(exif.latitude && exif.longitude);

    return {
      gps: hasGps
        ? {
            latitude: exif.latitude,
            longitude: exif.longitude,
            altitude: exif.altitude || undefined,
            timestamp: exif.DateTimeOriginal || exif.CreateDate || undefined,
          }
        : null,
      hasGps,
      camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : undefined,
      timestamp: exif.DateTimeOriginal || exif.CreateDate || undefined,
      rawMetadata: exif,
    };
  } catch (error) {
    console.error("EXIF parsing error:", error);
    return { gps: null, hasGps: false, rawMetadata: {} };
  }
}

/**
 * Validasi apakah koordinat GPS berada di wilayah Indonesia
 */
export function validateGpsCoordinates(lat: number, lng: number): boolean {
  const INDONESIA_BOUNDS = {
    minLat: -11.0, maxLat: 6.0,
    minLng: 95.0,  maxLng: 141.0,
  };

  return (
    lat >= INDONESIA_BOUNDS.minLat && lat <= INDONESIA_BOUNDS.maxLat &&
    lng >= INDONESIA_BOUNDS.minLng && lng <= INDONESIA_BOUNDS.maxLng
  );
}
