import {createHash, randomBytes, timingSafeEqual} from "crypto";

export function generateRandomHexString(length: number = 24) {
  return randomBytes(length).toString("hex");
}
export  function hashToken(token:string):string{
  return createHash("sha256").update(token).digest("hex");
}
export function compareToken(plainToken: string, hashedToken: string): boolean {
  try {
    // 1. Hash the incoming plain token to compare apples with apples
    const clientHash = hashToken(plainToken);

    // 2. Convert both hex strings to buffers for timingSafeEqual
    const bufferClient = Buffer.from(clientHash, 'hex');
    const bufferServer = Buffer.from(hashedToken, 'hex');

    // 3. Prevent timing attacks by ensuring lengths match before safe comparison
    if (bufferClient.length !== bufferServer.length) {
      return false;
    }

    return timingSafeEqual(bufferClient, bufferServer);
  } catch (err) {
    // Return false on any parsing or comparison errors to fail securely
    return false;
  }
}


export class ObjectHelper {
  static filterNullFields<T extends Object>(obj: Partial<T>): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null),
    ) as Partial<T>;
  }

  static excludeFields<T extends Object>(
    obj: Partial<T>,
    fields: string[],
  ): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, v]) => !fields.includes(key)),
    ) as Partial<T>;
  }

  static cleanData<T extends Object>(obj: Partial<T>): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined),
    ) as Partial<T>;
  }
}


