import { generateRandomString } from './generateRandomString';
import * as Crypto from 'expo-crypto';

export async function generateSubsonicToken(password: string) {
    const salt = await generateRandomString(16);
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, `${password}${salt}`);

    return { salt, hash };
}