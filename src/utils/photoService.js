import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// Upload een bestand naar Firebase Storage en geef de download-URL terug
async function uploadToStorage(path, file) {
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return await getDownloadURL(snapshot.ref)
}

// Verwijder een bestand via zijn pad
async function deleteAtPath(path) {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (e) {
    // Bestand bestaat al niet meer: geen probleem
    if (e.code !== 'storage/object-not-found') {
      console.warn('Foto verwijderen mislukt', e)
    }
  }
}

// ─── Maandfoto ────────────────────────────────────────────────────────────────
export function monthPhotoPath(userId, childId, year, month) {
  return `users/${userId}/children/${childId}/monthly/${year}/${month}`
}

export async function uploadMonthPhoto(userId, childId, year, month, file) {
  const path = monthPhotoPath(userId, childId, year, month)
  return await uploadToStorage(path, file)
}

export async function deleteMonthPhoto(userId, childId, year, month) {
  const path = monthPhotoPath(userId, childId, year, month)
  await deleteAtPath(path)
}

// ─── Profielfoto ──────────────────────────────────────────────────────────────
export function profilePhotoPath(userId, childId) {
  return `users/${userId}/children/${childId}/profile`
}

export async function uploadProfilePhoto(userId, childId, file) {
  const path = profilePhotoPath(userId, childId)
  return await uploadToStorage(path, file)
}

export async function deleteProfilePhoto(userId, childId) {
  const path = profilePhotoPath(userId, childId)
  await deleteAtPath(path)
}
