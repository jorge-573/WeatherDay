/** Synchronous so hooks can read persisted values in `useState` initializers. */
export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export type Coordinates = { latitude: number; longitude: number }

export interface GeolocationProvider {
  /** Rejects with a user-facing `Error` message when the position is unavailable. */
  getCurrentPosition(): Promise<Coordinates>
}

export interface Platform {
  storage: KeyValueStore
  geolocation: GeolocationProvider
}
