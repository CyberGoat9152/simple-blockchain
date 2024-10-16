import { createHash } from "crypto"
import { hash, validatedHash } from "./helpers"

export interface Block {
    header: {
        nonce: number
        hashBlock: string
    }
    payload: {
        sequence_num: number
        timestamp: number
        data: any
        lastHash: string
    }
}

export class Blockchain {
    #chain: Block[] = [];
    private prefixPOW = '0';

    constructor( private readonly difficulty: number = 4) {
        this.#chain.push(this.createGenesisBlock())
    }

    private createGenesisBlock(): Block {
        const payload: Block['payload'] = {
            sequence_num: 0,
            timestamp: +new Date(),
            data: 'First block',
            lastHash: '',
        }

        return {
            header: {
                nonce: 0,
                hashBlock: hash(JSON.stringify(payload))
            },
            payload
        }
    }

    get chain (): Block[] {
        return this.#chain
    }

    private get lastBlock (): Block {
        return this.#chain.at(-1) as Block
    }

    private lastBlockHash(): string{
        return this.lastBlock.header.hashBlock
    }

    createBlock (data: any): Block['payload'] {
        const newBlock: Block['payload'] = {
            sequence_num: this.lastBlock.payload.sequence_num + 1,
            timestamp: +new Date(),
            data: data,
            lastHash: this.lastBlockHash()
        }


        console.log(`Block #${newBlock.sequence_num} created ${JSON.stringify(newBlock)}`);
        return newBlock
    }


    mineBlock (block: Block['payload']): any{
        let nonce: number = 0;
        const start: number = +new Date();

        while (true)
        {    
            const hashBlock: string = hash(JSON.stringify(block))
            const hashPOW: string = hash(hashBlock+nonce)

            if (validatedHash({
                hash: hashPOW,
                difficulty: this.difficulty,
                prefix: this.prefixPOW
            })) {
                const final: number = +new Date();
                const reducedHash: string = hashBlock.slice(0, 12);
                const minigTime: number =  (final-start)/ 1000;

                console.log(`Block #${block.sequence_num} mined in ${minigTime} s.\n Hash ${reducedHash} (${nonce} tentativas)`);

                return {
                    minedBlock: {
                        payload: { ...block },
                        header: {
                            nonce,
                            hashBlock
                        }
                    }
                }
            }
            nonce++
        }
    }

    validateBlock(block: Block): boolean {
        if (block.payload.lastHash !== this.lastBlockHash()){
            console.error(`Block #${block.payload.sequence_num} invalid: The last hash is ${this.lastBlockHash().slice(0,12)} not ${block.payload.lastHash.slice(0,12)} `)
            return false
        }
        const hashTest: string = (hash(JSON.stringify(block.header.hashBlock)) + block.header.nonce)
        const hashPOW: string = hash(block.header.hashBlock + block.header.nonce);
        if (!validatedHash({
            hash: hashPOW,
            difficulty: this.difficulty,
            prefix: this.prefixPOW
        })) {
            console.error(`Block #${block.payload.sequence_num} invalid nonce`);
            return false;
        }
        return true
    }
    
    sendBlock (block: Block): Block[]{
        if (this.validateBlock(block)){ 
            this.#chain.push(block)
            console.log(`Block #${block.payload.sequence_num} has added\nblockchain: ${JSON.stringify(block, null, 2)}`)
        }

        return this.#chain
    }
}