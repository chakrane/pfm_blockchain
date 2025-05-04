import './App.css';
import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GestionChaines from './contracts/GestionChaines.json';

function Ex3() {
    const [state, setState] = useState({ web3: null, contract: null });
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [latestBlock, setLatestBlock] = useState(null);
    const [account, setAccount] = useState('');

    //
    const [web3, setWeb3] = useState(null);
    //const [contract, setContract] = useState(null);
    const [messageBlockChain, setMessageBlockChain] = useState('');
    const [messageInput, setMessageInput] = useState('');

    //CONCAT 2 CHAINE
    const [concatInputA, setConcatInputA] = useState('');
    const [concatInputB, setConcatInputB] = useState('');
    const [concatResult, setConcatResult] = useState('');

    //concat with message
    const [concatWithMessage, setConcatWithMessage] = useState('');
    const [concatWithMessageResult, setConcatWithMessageResult] = useState('');

    //lenght
    const [lengthinput, setLengthInput] = useState('');
    const [lenghtBlockChain, setLenghtBlockChain] = useState('');

    //compare
    const [compareInputA, setCompareInputA] = useState('');
    const [compareInputB, setCompareInputB] = useState('');
    const [compareBlockChain, setCompareBlockChain] = useState('');

    const [etherInput, setEtherInput] = useState('');

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
      const deployedContract = GestionChaines.networks[netId];
      console.log(deployedContract);
      const myContract = new instanceWeb3.eth.Contract(GestionChaines.abi, deployedContract.address);
      const accounts = await instanceWeb3.eth.getAccounts();

      await fetchLatestBlock();
      setAccount(accounts[0]);
      setState({ web3: instanceWeb3, contract: myContract });
    }
    if (provider) initConnection();
  }, []);

  async function blockChaineInfo(result, functionName){
    const {web3 } = state;
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
      functionName: functionName,
      args: decodedParams,
    });
  }
    async function readMessage() {
        const { contract } = state;
        const valeur = await contract.methods.getMessage().call();
        setMessageBlockChain(valeur);
        console.log('message blockchain : ',messageBlockChain);
    }
  
    const writeMessage = async () => {
        const { contract, web3 } = state;
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];
        
        const result = await contract.methods.setMessage(messageInput).send({ from: sender });
        await state.web3.eth.getTransactionReceipt(result.transactionHash);
        setMessageInput('');
        readMessage();
        blockChaineInfo(result, 'setMessage(string memory _msg)');
        await fetchLatestBlock();
    };

    const concatenerFront = async() => {
        const { contract, web3 } = state;
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.concatener(concatInputA, concatInputB).send({ from: accounts[0] });
        const value = await contract.methods.concatener(concatInputA, concatInputB).call();
        setConcatResult(value);
        
        setConcatInputA('');
        setConcatInputB('');
        await blockChaineInfo(result, 'concatener(string memory a, string memory b)');
        await fetchLatestBlock();
    }

    const concatenerAvecFront = async() => {
        const { contract, web3 } = state;
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.concatenerAvec(concatWithMessage).send({ from: accounts[0] });
        const value = await contract.methods.concatenerAvec(concatWithMessage).call();
        setConcatWithMessageResult(value);
        
        setConcatWithMessage('');
        await blockChaineInfo(result, 'concatenerAvec(string memory a)');
        await fetchLatestBlock();
    }

    const longueurFront = async() => {
        const { contract, web3 } = state;
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.longueur(lengthinput).send({ from: accounts[0] });
        const value = await contract.methods.longueur(lengthinput).call();
        setLenghtBlockChain(value);
        
        setLengthInput('');
        await blockChaineInfo(result, 'longueur(string memory s)');
        await fetchLatestBlock();
    }

    const comparerFront = async() => {
        const { contract, web3 } = state;
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.comparer(compareInputA, compareInputB).send({ from: accounts[0] });
        const value = await contract.methods.comparer(compareInputA, compareInputB).call();
        setCompareBlockChain(value);
        await blockChaineInfo(result, 'comparer(string memory a, string memory b)');
        await fetchLatestBlock();
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
        <h1 style={{ color: '#00aaff' }}>Exercice 3 : Traitement des chaines de caractères</h1>

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
            <h3>Message (set/get)</h3>
            <input
            type="text"
            onChange={(e) => setMessageInput(e.target.value)}
            value={messageInput}
            placeholder="Nouveau message"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />
            <button onClick={writeMessage} style={{
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
            Mettre à jour
            </button>
            {messageBlockChain && <p>Votre message : <strong>{messageBlockChain}</strong></p>}
        </div>

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
            <h3>Concatène deux chaines</h3>
            <input
            type="text"
            value={concatInputA}
            onChange={(e) => setConcatInputA(e.target.value)}
            placeholder="Chaine A"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />

            <input
            type="text"
            value={concatInputB}
            onChange={(e) => setConcatInputB(e.target.value)}
            placeholder="Chaine B"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />
            <button onClick={concatenerFront} style={{
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
            Concatener
            </button>
            {concatResult && <p>Résultat : <strong>{concatResult}</strong></p>}
        </div>

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
            <h3>Concatène avec message</h3>
            <input
            type="text"
            value={concatWithMessage}
            onChange={(e) => setConcatWithMessage(e.target.value)}
            placeholder="text ici"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />
            
            <button onClick={concatenerAvecFront} style={{
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
                Concatener
                </button>
                {concatWithMessageResult && <p>Résultat : <strong>{concatWithMessageResult}</strong></p>}
            </div>
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            padding: '2rem',
            borderRadius: '12px',
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
            <h3>Retourne la longueur d'une chaine</h3>
            <input
            type="text"
            value={lengthinput}
            onChange={(e) => setLengthInput(e.target.value)}
            placeholder="text ici"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />
            <button onClick={longueurFront} style={{
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
            Calculer longueur
            </button>
            {lenghtBlockChain && <p>longueur : <strong>{lenghtBlockChain}</strong></p>}
        </div>



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
            <h3>Compare deux chaines</h3>
            <input
            type="text"
            value={compareInputA}
            onChange={(e) => {
                setCompareInputA(e.target.value);
                setCompareBlockChain(''); // clear previous result when input changes
              }}
            placeholder="text ici"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />

            <input
            type="text"
            value={compareInputB}
            onChange={(e) => {
                setCompareInputB(e.target.value);
                setCompareBlockChain(''); // clear previous result when input changes
              }}
            placeholder="text ici"
            style={{
                padding: '12px 16px',
                fontSize: '1.1rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
            }}
            />
            <button onClick={comparerFront} style={{
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
            Comparer
            </button>
            {compareBlockChain !== null && compareBlockChain !== '' && <p>Les chaînes "{compareInputA}" et "{compareInputB}" sont {compareBlockChain ? "identiques 😊" : "différentes 😞"}</p>}
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
              <p><strong>Fonction appelée :</strong> {transactionDetails.functionName}</p>
              <p><strong>Nom du contrat:</strong> GestionChaines.sol</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Ex3;
