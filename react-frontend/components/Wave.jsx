import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import wavePortal from "../utils/WavePortal.json";
import { Button } from "react-bootstrap";

export default function Wave() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageText, setMessageText] = useState("");
  // const [loading, setLoading] = useState("");
  // storing all the waves
  const [allWaves, setAllWaves] = useState([]);
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xC6a01bA22b8Ee9e51ddBd753e78303AF1Df37CB7";

  const contractABI = wavePortal.abi;

  // method that gets all the waves from contract
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Calling the getAllWaves method from Smart Contract

        const waves = await wavePortalContract.getAllWaves();

        //  We only need address, timestamp, and message in our UI
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error in getting all the waves", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      alert("successfully connected your metamask wallet");
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); //provider is used to talk to ethereum nodes && ethers is a library used for mitgation of front end to contract
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves({
          gasLimit: 10000000000,
        });
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(messageText, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);
        //  setLoading(true);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        // setLoading(false);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        getAllWaves();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const handleChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message ---", messageText);
    wave();
    setMessageText("");
  };

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        wavePortal.abi,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <>
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">👋 Hey there!</div>
          <h2>Connect your Ethereum wallet and wave at me!</h2>
          {currentAccount && (
            <form onSubmit={handleSubmit}>
              <label>Message:</label>
              <div>
                <textarea
                  value={messageText}
                  onChange={handleChange}
                  rows={10}
                  cols={60}
                  placeholder="Type anything that you want here :)"
                />
                <input
                  type="submit"
                  value="Submit"
                  variant="warning"
                  className="waveButton"
                />
              </div>
            </form>
          )}
          {!currentAccount && (
            <>
              <Button
                variant="warning"
                className="waveButton"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </>
          )}

          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "OldLace",
                  marginTop: "16px",
                  padding: "8px",
                }}
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
