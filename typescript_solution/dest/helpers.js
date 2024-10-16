import { createHash } from "crypto";
export function hash(dado) {
    return createHash('sha256').update(JSON.stringify(dado)).digest('hex');
}
export function validatedHash({ hash, difficulty = 4, prefix = '0' }) {
    const check = prefix.repeat(difficulty);
    return hash.startsWith(check);
}
