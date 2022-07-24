import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are onbrowser and user have installed Metamask
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are in server OR user doesn't have Metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/9885d879da564e278d103054f6c1dd94"
  );

  web3 = new Web3(provider);
}

export default web3;
