import { Blockchain } from "./blcokchain.js";
const difficulty = Number(process.argv[2]) || 4;
const blockchain = new Blockchain();
const numBlocks = Number(process.argv[3]) || 2;
let chain = blockchain.chain;
for (let i = 1; i <= numBlocks; i++) {
    const block = blockchain.createBlock(`Block ${i}`);
    const mineInfo = blockchain.mineBlock(block);
    chain = blockchain.sendBlock(mineInfo.minedBlock);
    console.log("-========== BLOCKCHAIN ==========-");
    console.log(chain);
}
