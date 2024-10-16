var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Blockchain_chain;
import { hash, validatedHash } from "./helpers.js";
export class Blockchain {
    constructor(difficulty = 4) {
        this.difficulty = difficulty;
        _Blockchain_chain.set(this, []);
        this.prefixPOW = '0';
        __classPrivateFieldGet(this, _Blockchain_chain, "f").push(this.createGenesisBlock());
    }
    createGenesisBlock() {
        const payload = {
            sequence_num: 0,
            timestamp: +new Date(),
            data: 'First block',
            lastHash: '',
        };
        return {
            header: {
                nonce: 0,
                hashBlock: hash(JSON.stringify(payload))
            },
            payload
        };
    }
    get chain() {
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    }
    get lastBlock() {
        return __classPrivateFieldGet(this, _Blockchain_chain, "f").at(-1);
    }
    lastBlockHash() {
        return this.lastBlock.header.hashBlock;
    }
    createBlock(data) {
        const newBlock = {
            sequence_num: this.lastBlock.payload.sequence_num + 1,
            timestamp: +new Date(),
            data: data,
            lastHash: this.lastBlockHash()
        };
        console.log(`Block #${newBlock.sequence_num} created ${JSON.stringify(newBlock)}`);
        return newBlock;
    }
    mineBlock(block) {
        let nonce = 0;
        const start = +new Date();
        while (true) {
            const hashBlock = hash(JSON.stringify(block));
            const hashPOW = hash(hashBlock + nonce);
            if (validatedHash({
                hash: hashPOW,
                difficulty: this.difficulty,
                prefix: this.prefixPOW
            })) {
                const final = +new Date();
                const reducedHash = hashBlock.slice(0, 12);
                const minigTime = (final - start) / 1000;
                console.log(`Block #${block.sequence_num} mined in ${minigTime} s.\n Hash ${reducedHash} (${nonce} tentativas)`);
                return {
                    minedBlock: {
                        payload: Object.assign({}, block),
                        header: {
                            nonce,
                            hashBlock
                        }
                    }
                };
            }
            nonce++;
        }
    }
    validateBlock(block) {
        if (block.payload.lastHash !== this.lastBlockHash()) {
            console.error(`Block #${block.payload.sequence_num} invalid: The last hash is ${this.lastBlockHash().slice(0, 12)} not ${block.payload.lastHash.slice(0, 12)} `);
            return false;
        }
        const hashTest = (hash(JSON.stringify(block.header.hashBlock)) + block.header.nonce);
        const hashPOW = hash(block.header.hashBlock + block.header.nonce);
        if (!validatedHash({
            hash: hashPOW,
            difficulty: this.difficulty,
            prefix: this.prefixPOW
        })) {
            console.error(`Block #${block.payload.sequence_num} invalid nonce`);
            return false;
        }
        return true;
    }
    sendBlock(block) {
        if (this.validateBlock(block)) {
            __classPrivateFieldGet(this, _Blockchain_chain, "f").push(block);
            console.log(`Block #${block.payload.sequence_num} has added\nblockchain: ${JSON.stringify(block, null, 2)}`);
        }
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    }
}
_Blockchain_chain = new WeakMap();
