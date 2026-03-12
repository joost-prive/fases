// Cloudinary unsigned upload — geen creditcard nodig, gratis tot 25 GB
// Bij het bereiken van de limiet mislukken uploads gewoon; geen onverwachte rekening.
const CLOUD_NAME = 'duticvyu4'
const UPLOAD_PRESET = 'fases_upload'

/**
 * Upload een afbeelding naar Cloudinary en geef de secure_url terug.
 * Door een timestamp toe te voegen aan de public_id is elke upload uniek,
 * zodat het preset geen "overwrite"-instelling nodig heeft.
 */
async function uploadToCloudinary(file, publicId) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('public_id', publicId)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Upload mislukt (${res.status})`)
  }

  const data = await res.json()
  return data.secure_url
}

// ─── Vraagfoto ────────────────────────────────────────────────────────────────
// Elke upload krijgt een unieke public_id via timestamp; de URL wordt opgeslagen
// in Firestore/localStorage. Cloudinary-delete vereist server-side signing, dus
// verwijdering verwijdert alleen de URL — de foto in Cloudinary blijft staan maar
// wordt nooit meer weergegeven. Binnen 25 GB is dit geen probleem.

export async function uploadQuestionPhoto(_userId, childId, year, month, questionId, file) {
  const publicId = `${childId}_${year}_${month}_q${questionId}_${Date.now()}`
  return await uploadToCloudinary(file, publicId)
}

// ─── Profielfoto ──────────────────────────────────────────────────────────────

export async function uploadProfilePhoto(_userId, childId, file) {
  const publicId = `${childId}_profile_${Date.now()}`
  return await uploadToCloudinary(file, publicId)
}

export async function deleteProfilePhoto() {
  // no-op — URL wordt verwijderd via clearChildPhotoUrl in storage.js
}
