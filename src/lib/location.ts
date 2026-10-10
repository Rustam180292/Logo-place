import * as Location from 'expo-location';

import type { Coords } from './geo';

export type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

export interface LocationResult {
  status: LocationStatus;
  coords: Coords | null;
}

/**
 * Joylashuvga ruxsat so'raydi va bir martalik koordinatani oladi.
 * Ruxsat berilmasa yoki xato bo'lsa, `coords` `null` bo'lib qoladi —
 * chaqiruvchi tomon `DEFAULT_CENTER` ga tayanadi.
 */
export async function requestLocation(): Promise<LocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      return { status: 'denied', coords: null };
    }
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      status: 'granted',
      coords: { lat: position.coords.latitude, lng: position.coords.longitude },
    };
  } catch {
    return { status: 'error', coords: null };
  }
}

/** Oldin berilgan ruxsatni so'rovsiz tekshiradi. */
export async function getCachedLocation(): Promise<LocationResult> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      return { status: status === Location.PermissionStatus.DENIED ? 'denied' : 'idle', coords: null };
    }
    const last = await Location.getLastKnownPositionAsync();
    if (last) {
      return {
        status: 'granted',
        coords: { lat: last.coords.latitude, lng: last.coords.longitude },
      };
    }
    return requestLocation();
  } catch {
    return { status: 'error', coords: null };
  }
}
