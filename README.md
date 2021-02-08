# IITK-Bucks
IITKBucks is a cryprocurrency project that I did as a part of Programming Club's Summer Camp 2020. This repository contains the code for my server implemented in Javascript and the interactive GUI implemented in ReactJS.

## API Documentation

I implemented the following endpoints in my node:

- POST - /newBlock - accepts a new block to be added to the blockchain
- POST - /newPeer - accepts a request to connect to a peer
- GET - /getPeers - returns the list of current peers of the respective server
- GET - /getBlock/<index> - returns the block at the this index, in the current blockchain
- GET - /getPendingTransactions - returns the list of transactions that are yet to be mined
- POST - /newTransaction - accepts a new transaction which now needs to be mined
- POST - /getUnusedOutputs - returns the unused outputs of the key/alias given as input
- POST - /addAlias - adds alias for a public key
- POST - /getPublicKey - returns the public key of an alias

## Miner
The part for mining a new block had to run in parallel with the HTTP server. In order to prevent the main thread from blocking, I implemented multithreading in my application. For this purpose, I used worker threads in Javascript.

## Goals
- `Understanding the working of blockchains`: One of the aims was to understand terms like target, mining etc., and to learn about how the history of a blockchain is practically unmodifiable even though it is publicly available.
- `Understanding practical application of modern cryptography` : I also aimed to analyze the use of cryptographic methods like hash calculation, and the usage of digital signatures to prove ownership.
- `Understanding peer-to-peer networks`: I tried to learn how independent nodes in a P2P network function without the need of any supervising body, and why a single peer cannot go against the majority consensus.
- `Implementing a large project` : I gained hands-on experience of the development of multithreaded applications, and were introduced to the entire workflow of building such a large project from scratch.

## Deployment
Start the frontend of the app by opening the folder of `frontend` and run the command:
```
npm start
```
Start the server of the app by opening the folder of `backend` and run the command:
```
node App.js
```
