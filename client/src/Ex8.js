import './App.css';
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaymentContract from './contracts/Payment.json';

function Ex8() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [latestBlock, setLatestBlock] = useState(null);
  const [state, setState] = useState({ web3: null, contract: null });
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [web3, setWeb3] = useState(null);
  
  useEffect(() => {
    const init = async () => {

      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance); 

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = PaymentContract.networks[networkId];

      if (networkData) {
          const instance = new web3.eth.Contract(
          PaymentContract.abi,
          networkData.address
        );
        setContract(instance);
        const recipient = await instance.methods.recipient().call();
        setRecipient(recipient);
        fetchLatestBlock();
      } else {
        alert("Le contrat n'est pas déployé sur ce réseau.");
      }
    };

    init();
  }, []);

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

  async function blockChaineInfo(web3, result, functionName) {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const txReceipt = await web3.eth.getTransactionReceipt(result.transactionHash);
    const txInfo = await web3.eth.getTransaction(result.transactionHash);
    const block = await web3.eth.getBlock(txReceipt.blockNumber);
    const balanceAfter = await web3.eth.getBalance(sender);
    const gasUsed = Number(txReceipt.gasUsed);
    const gasPrice = Number(txInfo.gasPrice);
    const fee = gasUsed * gasPrice;
    const feeInGwei = fee / 1e9;

    let _decodedParams;
    try {
      if (txInfo.input && txInfo.input.length > 10) {
        _decodedParams = web3.eth.abi.decodeParameters(['uint256'], txInfo.input.slice(10));
      } else {
        _decodedParams = "Aucun paramètre";
      }
    } catch (error) {
      _decodedParams = "Décodage impossible";
    }

    const decodedParams = _decodedParams;
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
      functionName: functionName,
      args: decodedParams,
    });
  }

  const sendPayment = async () => {
    if (!amount || isNaN(amount)) return alert("Montant invalide");
    const result = await contract.methods.receivePayment().send({
      from: account,
      value: Web3.utils.toWei(amount, 'ether'),
    });
    await fetchLatestBlock();
    blockChaineInfo(web3, result, 'receivePayment()');
    alert("Paiement envoyé");
  };

  const withdraw = async () => {
    const result = await contract.methods.withdraw().send({ from: account });
    await fetchLatestBlock();
    blockChaineInfo(web3, result, 'withdraw()');
    alert("Retrait effectué (si autorisé)");
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
        <h1 style={{ color: '#00aaff' }}>Exercice 8: Utilisation des variables globales (msg.sender et msg.value)</h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '300px'
          }}>
            <h2>Contrat Payment</h2>
            <p><strong>Votre adresse :</strong> {account}</p>
            <p><strong>Destinataire :</strong> {recipient}</p>

            <h3>Envoyer un paiement</h3>
            <input
              type="text"
              placeholder="Montant en ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={sendPayment}>Envoyer</button>

            <h3>Retirer le solde (réservé au destinataire)</h3>
            <button onClick={withdraw}>Retirer</button>
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

          <hr />

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333' }}>Infos du contrat:</h3>
            <p><strong>Adresse:</strong> {state.contract?.options.address}</p>
            <p><strong>Compte:</strong> {account}</p>
          </div>
          <hr />

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

          <hr />

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
              <p><strong>Fonction appelée :</strong> {transactionDetails.functionName}</p>
              <p><strong>Nom du contrat:</strong> GestionChaines.sol</p>
            </div>
          )}
        </div>


      </header>
    </div>
  );
}

export default Ex8;
