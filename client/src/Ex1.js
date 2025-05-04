import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Somme from './contracts/Somme.json';

function Ex1() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState("0");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    async function initConnection() {
      const instanceWeb3 = new Web3(provider);
      const netId = await instanceWeb3.eth.net.getId();
      const deployedContract = Somme.networks[netId];
      const myContract = new instanceWeb3.eth.Contract(Somme.abi, deployedContract.address);
      const accounts = await instanceWeb3.eth.getAccounts();

      const latest = await instanceWeb3.eth.getBlock("latest");

      // Conversion sécurisée des BigInt
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

      setAccount(accounts[0]);
      setState({ web3: instanceWeb3, contract: myContract });
      setLatestBlock(formattedBlock);
    }
    if (provider) initConnection();
  }, []);

  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const valeur = await contract.methods.getValue().call();
      setData(valeur);
    }
    if (state.contract) readData();
  }, [state]);

  async function writeData() {
    const { contract, web3 } = state;
    const valeur1 = document.querySelector('#valeur1').value;
    const valeur2 = document.querySelector('#valeur2').value;

    if (!valeur1 || isNaN(valeur1)) {
      alert("Veuillez entrer valeur 1 numeric");
      return;
    }

    if (!valeur2 || isNaN(valeur2)) {
      alert("Veuillez entrer valeur 2 numeric");
      return;
    }
  
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    console.log('from accounts : ', accounts);
    console.log('from address : ', sender);
  
    const tx = await contract.methods.addition2(valeur1, valeur2).send({ from: sender });
  
    const txReceipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
    const txInfo = await web3.eth.getTransaction(tx.transactionHash);
    const block = await web3.eth.getBlock(txReceipt.blockNumber);
    const balanceAfter = await web3.eth.getBalance(sender);
  
    const gasUsed = Number(txReceipt.gasUsed); // Conversion explicite en Number
    const gasPrice = Number(txInfo.gasPrice); // Conversion explicite en Number
  
    // Calcul des frais en Wei
    const fee = gasUsed * gasPrice;
  
    // Conversion en Gwei (1 Gwei = 1e9 Wei)
    const feeInGwei = fee / 1e9;
  
    const decodedParams = web3.eth.abi.decodeParameters(['uint256', 'uint256'], txInfo.input.slice(10));
  
    setTransactionDetails({
      hash: tx.transactionHash,
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
      functionName: 'addition2(uint, uint)',
      args: decodedParams,
    });
  
    const updatedValue = await contract.methods.getValue().call();
    setData(updatedValue);
  }

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
        <h1 style={{ color: '#00aaff' }}>TP3 - Ex1</h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid #ddd',
          backgroundColor: '#f1f7ff',
        }}>
          <input id="valeur1" placeholder="Variable 1" type="number" style={{
            padding: '12px 18px', fontSize: '16px', width: '220px',
            borderRadius: '8px', border: '1px solid #ccc'
          }} />
          <input id="valeur2" placeholder="Variable 2" type="number" style={{
            padding: '12px 18px', fontSize: '16px', width: '220px',
            borderRadius: '8px', border: '1px solid #ccc'
          }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={writeData} style={{
            padding: '12px 24px', fontSize: '16px',
            backgroundColor: '#00aaff', border: 'none',
            borderRadius: '8px', cursor: 'pointer',
            width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#008fcc'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00aaff'}>
            Calculer
          </button>
        </div>

        <div style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '10px',
          border: '1px solid #ddd',
          backgroundColor: '#f1f7ff',
          marginBottom: '2rem',
        }}>
          <p style={{ fontSize: '20px', color: '#333' }}>Somme des deux variables : {data}</p>
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
              <p><strong>Fonction appelée :</strong> {transactionDetails.functionName}(a: {transactionDetails.args[0]}, b: {transactionDetails.args[1]})</p>
              <p><strong>Nom du contrat:</strong> Somme.sol</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Ex1;
