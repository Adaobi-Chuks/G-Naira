import './App.css'
import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/G-Naira.json";

const getEthereumObject = () => window.ethereum;

const extractErrorMessage = (error) => {
  try {
    const errorString = error.toString();
    const start = errorString.indexOf('execution reverted: "') + 21;
    const end = errorString.indexOf('"', start);
    return errorString.slice(start, end);
  } catch (e) {
    return error.message;
  }
};

function App() {
  const contractAddress = "0x8C455372A2E93a15cc3F1433281E024CF39A31FE";
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

        window.prompt(`${amount}GNR minted successfully`);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
      window.prompt(extractErrorMessage(error.message));
    }
  };

  const handleMint = async (event) => {
    event.preventDefault();
    const mintAmount = document.getElementById('mint').value;
    const mintAddress = document.getElementById('mintAddress').value;
    await mint(mintAddress, mintAmount);
    document.getElementById('mint').value = "";
    document.getElementById('mintAddress').value = "";
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

        window.prompt(`${amount}GNR burned successfully`);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
      window.prompt(extractErrorMessage(error.message));
    }
  };

  const blacklist = async (account) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log(contract)
        const blacklistTxn = await contract.blacklistAddress(account);
        console.log(1)

        await blacklistTxn.wait();

        window.prompt(`${account} blacklisted successfully`);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error);
      window.prompt(extractErrorMessage(error.message));
    }
  };

  const handleBurn = async (event) => {
    event.preventDefault();
    const burnAmount = document.getElementById('burn').value;
    const burnAddress = document.getElementById('burnAddress').value;
    await burn(burnAddress, burnAmount);
    document.getElementById('burn').value = "";
    document.getElementById('burnAddress').value = "";
    await getBalance(currentAccount);
  };

  const handleBlacklist = async (event) => {
    event.preventDefault();
    const account = document.getElementById('blacklist').value;
    await blacklist(account);
    document.getElementById('blacklist').value = "";
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
        <div className='balance'>Balance: {balance.toString()}</div>

        <form onSubmit={handleMint}>
          <div>
            <input className='address' id='mint' placeholder="Enter Address" />
            <input id='mintAddress' placeholder="Amount" />
            <button type="submit" className="submit-btn">Mint</button>
          </div>
        </form>

        <form onSubmit={handleBurn}>
          <div>
            <input className='address' id='burn' placeholder="Enter Address" />
            <input id='burnAddress' placeholder="Amount" />
            <button type="submit" className="submit-btn">Burn</button>
          </div>
        </form>

        <form onSubmit={handleBlacklist}>
          <div>
            <input className='address' id='blacklist' placeholder="Enter Address" />
            <button type="submit" className="submit-btn">Blacklist</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App
