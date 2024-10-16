import { BinaryLike, createHash } from "crypto";

export function hash (dado: BinaryLike): string {
   return  createHash('sha256').update(JSON.stringify(dado)).digest('hex')
} 


export function validatedHash ({hash, difficulty = 4, prefix = '0'}: {
    hash: string,
    difficulty: number,
    prefix: string
}): boolean {
    const check: string = prefix.repeat(difficulty);
    return hash.startsWith(check)
}