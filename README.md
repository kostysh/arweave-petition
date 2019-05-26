# arweave-petition
Test Arweave application that implements petitions use-case

> This demo application is made according to [Open Web Hackathon: Build A Simple Permaweb App](https://gitcoin.co/issue/ArweaveTeam/Bounties/1/2929)  

- You can create unlimited count of simple petitions (it is demo app only) and publish them on the [Arweave blockchain](https://www.arweave.org/).  
- Anyone who have a Arweave wallet can sign your petitions and number of signs will be displayed by right side of the petition. 
- Anyone who have a Arweave wallet can create his own petitions. 

Application is constantly available on the link: [https://arweave.net/-hSB7R6ysWaiauuHRXT5laHA-XbSgMt18FXuovroUzE](https://arweave.net/-hSB7R6ysWaiauuHRXT5laHA-XbSgMt18FXuovroUzE)

## Initialisation
```sh
npm i
```

## Start app locally

Then app started it should be available via web browser by address http://localhost:3000

```sh
npm start
```

## App deployment

Be sure your wallet keyfile is placed in the root (ignored on GitHub).  
This file should be named: `arweave-keyfile.json`.  
If you don't have a wallet, please get one [here](https://tokens.arweave.org/).

```sh
npm run savekey
npm run deploy
```