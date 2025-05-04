import './App.css';
import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Convertisseur from './contracts/Convertisseur.json';

function Ex2() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [account, setAccount] = useState('');

  //
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [etherInput, setEtherInput] = useState('');
  const [weiFromEther, setWeiFromEther] = useState('');
  const [weiInput, setWeiInput] = useState('');
  const [etherFromWei, setEtherFromWei] = useState('');

  const fetchLatestBlock = async () => {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    const instanceWeb3 = new Web3(provider);

    const latest = await instanceWeb3.eth.getBlock("latest");
    const formattedBlock = {
      number: latest.number,
      hash: latest.hash,
      timestamp: Number(latest.timestamp),
      parentHash: latest.parentHash,
      nonce: latest.nonce,
      transactions: latest.transactions.length,
      difficulty: Number(latest.difficulty),
      gasLimit: Number(latest.gasLimit),
      gasUsed: Number(latest.gasUsed),
      size: Number(latest.size),
    };
    setLatestBlock(formattedBlock);
  };


  //
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    async function initConnection() {
      const instanceWeb3 = new Web3(provider);
      const netId = await instanceWeb3.eth.net.getId();
      const deployedContract = Convertisseur.networks[netId];
      const myContract = new instanceWeb3.eth.Contract(Convertisseur.abi, deployedContract.address);
      const accounts = await instanceWeb3.eth.getAccounts();

      await fetchLatestBlock();
      setAccount(accounts[0]);
      setState({ web3: instanceWeb3, contract: myContract });
    }
    if (provider) initConnection();
  }, []);

  

  const convertEtherToWei = async () => {
    if (!etherInput || isNaN(etherInput) || etherInput <= 0) {
      alert("Veuillez entrer un montant valide en Ether.");
      return;
    }
    const { contract, web3 } = state;
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    console.log(sender);
    
    const result = await contract.methods.etherEnWei(etherInput).send({ from: sender });

    const txReceipt = await web3.eth.getTransactionReceipt(result.transactionHash);
    const txInfo = await web3.eth.getTransaction(result.transactionHash);
    const block = await web3.eth.getBlock(txReceipt.blockNumber);
    const balanceAfter = await web3.eth.getBalance(sender);
  
    const gasUsed = Number(txReceipt.gasUsed); // Conversion explicite en Number
    const gasPrice = Number(txInfo.gasPrice); // Conversion explicite en Number
  
    // Calcul des frais en Wei
    const fee = gasUsed * gasPrice;
  
    // Conversion en Gwei (1 Gwei = 1e9 Wei)
    const feeInGwei = fee / 1e9;
  
    const decodedParams = web3.eth.abi.decodeParameters(['uint256'], txInfo.input.slice(10));
  
    setTransactionDetails({
      hash: result.transactionHash,
      from: txInfo.from,
      to: txInfo.to,
      nonce: txInfo.nonce,
      value: web3.utils.fromWei(txInfo.value, 'ether'),
      gasLimit: txInfo.gas,
      gasUsed,
      feeGwei: feeInGwei,
      status: txReceipt.status,
      block: txReceipt.blockNumber,
      timestamp: block.timestamp ? new Date(Number(block.timestamp) * 1000).toLocaleString() : "Date inconnue",
      balanceAfter: web3.utils.fromWei(balanceAfter, 'ether'),
      functionName: 'etherEnWei(uint)',
      args: decodedParams,
    });

    if (result.events && result.events.EtherConverted) {
      await fetchLatestBlock();
      const eventData = result.events.EtherConverted.returnValues;
      setWeiFromEther(eventData.weiOutput);
    } else {
      console.error("Événement EtherConverted introuvable");
    }
  };

  const convertWeiToEther = async () => {

    if (!weiInput || isNaN(weiInput) || weiInput <= 0) {
      alert("Veuillez entrer un montant valide en Wei.");
      return;
    }

    const { contract, web3 } = state;
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    console.log(sender);
    const result = await contract.methods.weiEnEther(weiInput).send({ from: sender });

    const txReceipt = await web3.eth.getTransactionReceipt(result.transactionHash);
    const txInfo = await web3.eth.getTransaction(result.transactionHash);
    const block = await web3.eth.getBlock(txReceipt.blockNumber);
    const balanceAfter = await web3.eth.getBalance(sender);
  
    const gasUsed = Number(txReceipt.gasUsed);
    const gasPrice = Number(txInfo.gasPrice);
  
    // Calcul des frais en Wei
    const fee = gasUsed * gasPrice;
  
    // Conversion en Gwei (1 Gwei = 1e9 Wei)
    const feeInGwei = fee / 1e9;
  
    const decodedParams = web3.eth.abi.decodeParameters(['uint256'], txInfo.input.slice(10));
  
    setTransactionDetails({
      hash: result.transactionHash,
      from: txInfo.from,
      to: txInfo.to,
      nonce: txInfo.nonce,
      value: web3.utils.fromWei(txInfo.value, 'ether'),
      gasLimit: txInfo.gas,
      gasUsed,
      feeGwei: feeInGwei,
      status: txReceipt.status,
      block: txReceipt.blockNumber,
      timestamp: block.timestamp ? new Date(Number(block.timestamp) * 1000).toLocaleString() : "Date inconnue",
      balanceAfter: web3.utils.fromWei(balanceAfter, 'ether'),
      functionName: 'weiEnEther(uint)',
      args: decodedParams,
    });

    if (result.events && result.events.WeiConverted) {
      const eventData = result.events.WeiConverted.returnValues;
      console.log("ETH : ", eventData.etherOutput);
      setEtherFromWei(eventData.etherOutput);
    } else {
      console.error("Événement WeiConverted introuvable");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/" style={{
          marginTop: '2rem',
          textDecoration: 'none',
          color: '#fff',
          backgroundColor: '#007bff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
          ← Sommaire
        </Link>
        <h1 style={{ color: '#00aaff' }}>TP3 - Ex2 : Convertisseur ETH ↔ Wei</h1>

        <div style={{
  display: 'flex',
  justifyContent: 'center',
  gap: '3rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  padding: '2rem',
  borderRadius: '12px',
  border: '1px solid #ddd',
  backgroundColor: '#e9f4ff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}}>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minWidth: '300px'
  }}>
    <h3>ETH ➝ Wei</h3>
    <input
      type="number"
      value={etherInput}
      onChange={(e) => setEtherInput(e.target.value)}
      placeholder="Montant en Ether"
      style={{
        padding: '12px 16px',
        fontSize: '1.1rem',
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
    />
    <button onClick={convertEtherToWei} style={{
      padding: '10px 20px',
      fontSize: '1.1rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      width: '100%',
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
      Convertir en Wei
    </button>
    {weiFromEther && <p>Résultat : <strong>{weiFromEther}</strong> Wei</p>}
  </div>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minWidth: '300px'
  }}>
    <h3>Wei ➝ ETH</h3>
    <input
      type="number"
      value={weiInput}
      onChange={(e) => setWeiInput(e.target.value)}
      placeholder="Montant en Wei"
      style={{
        padding: '12px 16px',
        fontSize: '1.1rem',
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
    />
    <button onClick={convertWeiToEther} style={{
      padding: '10px 20px',
      fontSize: '1.1rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      width: '100%',
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
      Convertir en Ether
    </button>
    {etherFromWei && <p>Résultat : <strong>{etherFromWei}</strong> ETH</p>}
  </div>
</div>


        <div style={{
          padding: '2rem',
          borderRadius: '10px',
          border: '1px solid #ddd',
          backgroundColor: '#f7fbff',
          marginBottom: '3rem',
        }}>
          <h2 style={{ color: '#00aaff' }}>Informations de la Blockchain</h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333' }}>Infos du réseau:</h3>
            <p><strong>URL:</strong> HTTP://127.0.0.1:7545</p>
            <p><strong>ID:</strong> 5777</p>
          </div>

          <hr/>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333' }}>Infos du contrat:</h3>
            <p><strong>Adresse:</strong> {state.contract?.options.address}</p>
            <p><strong>Compte:</strong> {account}</p>
          </div>
          <hr/>

          {latestBlock && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#333' }}>Infos du dernier bloc:</h3>
              <p><strong>N°:</strong> #{latestBlock.number}</p>
              <p><strong>Hash:</strong> {latestBlock.hash}</p>
              <p><strong>Timestamp:</strong> {new Date(latestBlock.timestamp * 1000).toLocaleString()}</p>
              <p><strong>ParentHash:</strong> {latestBlock.parentHash}</p>
              <p><strong>Nonce:</strong> {latestBlock.nonce}</p>
              <p><strong>Transactions:</strong> {latestBlock.transactions}</p>
              <p><strong>Difficulty:</strong> {latestBlock.difficulty}</p>
              <p><strong>GasLimit:</strong> {latestBlock.gasLimit}</p>
              <p><strong>GasUsed:</strong> {latestBlock.gasUsed}</p>
              <p><strong>Size:</strong> {latestBlock.size}</p>
            </div>
          )}

          <hr/>

          {transactionDetails && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#333' }}>Détails de la dernière transaction</h3>
              <p><strong>Numéro:</strong> 1</p>
              <p><strong>Expéditeur :</strong> {transactionDetails.from}</p>
              <p><strong>Destinataire :</strong> {transactionDetails.to}</p>
              <p><strong>Hash:</strong> <br />{transactionDetails.hash}</p>
              <p><strong>Nonce:</strong> {transactionDetails.nonce}</p>
              <p><strong>Montant:</strong> {transactionDetails.value} ETH</p>
              <p><strong>Frais de transaction (Gas):</strong> {transactionDetails.feeGwei.toFixed(9)} Gwei</p>
              <p><strong>Limite de Gas:</strong> {transactionDetails.gasLimit}</p>
              <p><strong>Gas utilisé:</strong> {transactionDetails.gasUsed}</p>
              <p><strong>Solde après transaction:</strong> {transactionDetails.balanceAfter} ETH</p>
              <p><strong>Statut:</strong> {transactionDetails.status ? "Succès" : "Échec"}</p>
              <p><strong>Bloc:</strong> {transactionDetails.block}</p>
              <p><strong>Horodatage:</strong> {transactionDetails.timestamp}</p>
              <p><strong>Fonction appelée :</strong> {transactionDetails.functionName}(a: {transactionDetails.args[0]})</p>
              <p><strong>Nom du contrat:</strong> Convertisseur.sol</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Ex2;
