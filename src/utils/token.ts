export async function signHMAC(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data)
  )

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64)
  return new Uint8Array([...binary].map(c => c.charCodeAt(0)))
}

export async function verifyHMAC(secret: string, data: string, signatureB64: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const signatureBytes = base64ToUint8Array(signatureB64)

  return await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    new TextEncoder().encode(data)
  )
}


 
