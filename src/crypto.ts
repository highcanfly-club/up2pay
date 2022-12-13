import { RSAKey, KEYUTIL, KJUR } from "jsrsasign";

/**
 * 
 * @param base64str 
 * @returns a hex string converted from the input
 */
export function base64ToHex(base64str: string): string {
    const _raw = Buffer.from(base64str, 'base64')
    let _result = "";
    for (let i = 0; i < _raw.length; i++) {
        const hex = Number(_raw[i]).toString(16)
        _result += hex.length === 2 ? hex : "0" + hex;
    }
    return _result.toUpperCase();
  }

  /**
   * High performance ArrayBuffer to base64
   * @param arrayBuffer input array buffer
   * @returns a base64 encoded string
   */
  export function base64ArrayBuffer(arrayBuffer: ArrayBuffer): string {
    let base64 = "";
    let encodings =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  
    let bytes = new Uint8Array(arrayBuffer);
    let byteLength = bytes.byteLength;
    let byteRemainder = byteLength % 3;
    let mainLength = byteLength - byteRemainder;
  
    let a: number, b: number, c: number, d: number;
    let chunk: number;
  
    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
  
      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63; // 63       = 2^6 - 1
  
      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
  
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];
  
      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
  
      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1
  
      base64 += encodings[a] + encodings[b] + "==";
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
  
      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
  
      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1
  
      base64 += encodings[a] + encodings[b] + encodings[c] + "=";
    }
    return base64;
  }

  /**
   * 
   * @param message a string containing the message
   * @param signature64 a base64 encoded SHA1withRSA signature
   * @param pubkey a PEM RSA pubkey (like -----BEGIN PUBLIC KEY-----/…/-----END PUBLIC KEY-----)
   * @returns true if signature is valid
   */
export function isSignatureIsValid(message:string,signature64: string, pubkey: string): boolean {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const rsa = KEYUTIL.getKey(pubkey) as RSAKey;
    const sig = new KJUR.crypto.Signature({ alg: "SHA1withRSA" });
    sig.init(rsa);
    sig.updateString(message);
    const signatureHex = base64ToHex(signature64);
    if (
        signatureHex.length !== 256 &&
        signatureHex.length !== 512 &&
        signatureHex.length !== 1024 &&
        signatureHex.length !== 2048
      ) {
        return false;
      }

    return sig.verify(signatureHex);
  }
