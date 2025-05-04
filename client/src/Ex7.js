import './App.css';
import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Rectangle from './contracts/Rectangle.json';

function Ex7() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [account, setAccount] = useState('');

  //surface
  const [surface, setSurface] = useState('');

  //afficherInfos
  const [infos, setInfos] = useState('');

  //afficheLoLa
  const [lo, setLo] = useState('');
  const [la, setLa] = useState('');

  //afficheXY
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  //
  const [web3, setWeb3] = useState(null);
  

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

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    async function initConnection() {
      const instanceWeb3 = new Web3(provider);
      const netId = await instanceWeb3.eth.net.getId();
      const deployedContract = Rectangle.networks[netId];
      const myContract = new instanceWeb3.eth.Contract(Rectangle.abi, deployedContract.address);
      const accounts = await instanceWeb3.eth.getAccounts();
      await fetchLatestBlock();
      setAccount(accounts[0]);
      setState({ web3: instanceWeb3, contract: myContract });
    }
    if (provider) initConnection();
  }, []);

  const fetchData = async () => {
    const { contract, web3 } = state;
    const accounts = await web3.eth.getAccounts();
    const valueSurface = await contract.methods.surface().call({ from: accounts[0] });
    setSurface(valueSurface);


    const valueInfos = await contract.methods.afficheInfos().call();
    setInfos(valueInfos);

    const lola = await contract.methods.afficheLoLa().call();
    setLo(lola[0]);
    setLa(lola[1]);


    const xy = await contract.methods.afficheXY().call();
    setX(xy[0]);
    setY(xy[1]);
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
        <h1 style={{ color: '#00aaff' }}>Exercice 7: Programmation Orientée Objet (Formes géométriques)</h1>

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
            <button onClick={fetchData} style={{
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
              Afficher les infos
            </button>
            {surface !== '' && <p>Surface : <strong>{surface}</strong></p>}
            {infos !== '' && <p>Infos : <strong>{infos}</strong></p>}
            {lo !== '' && <p><strong>Dimensions :</strong> {lo} x {la}</p>}
            {x !== '' && <p><strong>Coordonnées :</strong> {x} x {y}</p>}
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
              <p><strong>Nom du contrat:</strong> Rectangle.sol</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Ex7;
