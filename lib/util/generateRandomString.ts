import * as Crypto from 'expo-crypto';

export async function generateRandomString(length: number): Promise<string> {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsetLength = charset.length;

    const randomBytes = await Crypto.getRandomBytesAsync(length);

    const randomString = Array.from(randomBytes)
        .map((byte) => charset[byte % charsetLength])
        .join('');

    return randomString;
}