// Returns true when the app is deployed in read-only (public) mode.
// Set VITE_READONLY=true in .env.production to hide add/edit/delete UI.
export function useReadonly() {
  return import.meta.env.VITE_READONLY === 'true'
}
