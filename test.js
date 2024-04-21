const nearAPI = require("near-api-js");
const { KeyPair, Contract } = require('near-api-js');
// creates a keyStore that searches for keys in .near-credentials
// requires credentials stored locally by using a NEAR-CLI command: `near login`
// https://docs.near.org/tools/cli#near-login

const { keyStores } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const { connect } = nearAPI;

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore, // first create a key store
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

const newKeyPair = KeyPair.fromRandom('ed25519');
newKeyPair.public_key = newKeyPair.publicKey.toString();

async function create_testnet() {
    const nearConnection = await connect(connectionConfig);
    // create a new account using funds from the account used to create it.
    const account = await nearConnection.account("pivortex.testnet");

    const contract = new Contract(account, "testnet", {
        changeMethods: ["create_account"], // your smart-contract has a function `my_smart_contract_function`
      });
      await contract.create_account({
        args: {
            new_account_id: "dfpivortex.testnet",
            new_public_key: newKeyPair.publicKey.toString(),
        },
        gas: "300000000000000", // Optional: attached GAS
        amount: "1000000000000000000000000" // Optional: attached deposit in yoctoNEAR
    });
}

create_testnet();