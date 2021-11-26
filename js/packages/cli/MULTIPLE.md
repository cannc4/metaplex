# Mint multiple NFTs

Delete .cache before the operations

## Multiple uploads
```bash
ts-node src/candy-machine-cli.ts upload '../../../../assets' --env devnet --keypair ~/.config/solana/devnet.json && 
ts-node src/cli-nft mint --env devnet --keypair ~/.config/solana/devnet.json
```
## Upload with .wav files
```bash
ts-node src/candy-machine-cli.ts upload-with-audio '../../../../assets' --env devnet --keypair ~/.config/solana/devnet.json && 
ts-node src/cli-nft mint --env devnet --keypair ~/.config/solana/devnet.json
```

