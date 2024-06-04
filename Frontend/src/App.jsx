import './App.css'
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/G-Naira.json";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

function App() {
  const contractAddress = "0x417100B9D42CdB746fbeF46Eb0A7a651743B155A";
  const contractABI = abi.abi;
  const [currentAccount, setCurrentAccount] = useState("");
  const [balance, setBalance] = useState(0);

  const getBalance = async (account) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const balance = await contract.balanceOf(account);

        console.log(balance.toString())
        setBalance(balance);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mint = async (account, amount) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const mintTxn = await contract.mint(account, amount);

        await mintTxn.wait();
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMint = async (event) => {
    event.preventDefault();
    const mintAmount = document.getElementById('mint').value;
    await mint(currentAccount, mintAmount);
    await getBalance(currentAccount);
  };

  const burn = async (account, amount) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const burnTxn = await contract.burn(account, amount);

        await burnTxn.wait();

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
      window.prompt("NOT GOVERNOR")
    }
  };

  const handleBurn = async (event) => {
    event.preventDefault();
    const burnAmount = document.getElementById('burn').value;
    await burn(currentAccount, burnAmount);
    await getBalance(currentAccount);
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getBalance(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='container'>
        <h1 className='title'>G-Naira DApp</h1>
        {
          currentAccount ?
            (<div className='welcome'>Welcome {currentAccount}</div>)
            :
            (<button className='connect-wallet-btn' onClick={connectWallet} >Connect Wallet</button>)
        }
        <div className='feedback'>Balance: {balance.toString()}</div>

        <form onSubmit={handleMint}>
          <div>
            <input id='mint'></input>
            <button type="submit" className="submit-btn">Mint</button>
          </div>
        </form>

        <form onSubmit={handleBurn}>
          <div>
            <input id='burn'></input>
            <button type="submit" className="submit-btn">Burn</button>
          </div>
        </form>

        <form>
          <div>
            <input id='blacklist'></input>
            <button type="submit" className="submit-btn">Blacklist</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App
