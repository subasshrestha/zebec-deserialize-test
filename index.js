const { AnchorProvider, Wallet, Program } = require('@project-serum/anchor');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const idl = require('./zebec.json');

const opts = {
  preflightCommitment: "confirmed"
};
const programID = new PublicKey("2AYa9x2wYRcJJ46zhpK6MHwUf4cK3qpje9xwhiQBjnf9");
const network = 'https://api.devnet.solana.com';
const connection = new Connection(network, opts.preflightCommitment);
const payer = Keypair.generate();
const wallet = new Wallet(payer);
const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment);
const program = new Program(idl, programID, provider);

const userWallet = new PublicKey("8Q3dtXuvFJHRVMhSLwVzdPpC13AGH61Q18H3FAJeBjEA");

async function main() {
  const streams = await program.account.streamToken.all(
    [
      {
        memcmp: {
          offset: 48,
          bytes: userWallet.toBase58(),
        }
      }
    ]
  );
  const parsedStreams = streams.map((stream) => {
    return {
      id: stream.publicKey.toBase58(),
      startTime: stream.account.startTime.toString(),
      endTime: stream.account.endTime.toString(),
      paused: stream.account.paused.toString(),
      withdrawLimit: stream.account.withdrawLimit.toString(),
      amount: stream.account.amount.toString(),
      sender: stream.account.sender.toBase58(),
      receiver: stream.account.receiver.toBase58(),
      tokenMint: stream.account.tokenMint.toBase58(),
      withdrawn: stream.account.withdrawn.toString(),
      pausedAt: stream.account.pausedAt.toString(),
      feeOwner: stream.account.feeOwner.toBase58(),
      pausedAmt: stream.account.pausedAmt.toString(),
      canCancel: stream.account.canCancel,
      canUpdate: stream.account.canUpdate
    };
  });
  console.log(parsedStreams);
}
main();