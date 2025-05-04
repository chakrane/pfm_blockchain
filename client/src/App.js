import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Ex1 from './Ex1';
import Ex2 from './Ex2';
import Ex3 from './Ex3';
import Ex4 from './Ex4';
import Ex5 from './Ex5';
import Ex6 from './Ex6';
import Ex7 from './Ex7';
import Ex8 from './Ex8';

function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Projet de Fin de Module BlockChain</h1>
      <Link to="/ex1">
        <button>Exercice 1 : somme des deux variables</button>
      </Link>
      <br/>
      <br/>
      <Link to="/ex2">
        <button>Exercice 2 : Conversion des cryptomonnaies</button>
      </Link>

      <br/>
      <br/>
      <Link to="/ex3">
        <button>Exercice 3 : Tritement des chaines de caractères</button>
      </Link>

      <br/>
      <br/>
      <Link to="/ex4">
        <button>Exercice 4: Tester le signe d'un nombre</button>
      </Link>
      <br/>
      <br/>
      <Link to="/ex5">
        <button>Exercice 5 : Tester la parité d'un nombre</button>
      </Link>
      <br/>
      <br/>
      <Link to="/ex6">
        <button>Exercice 6: Gestion des tableaux</button>
      </Link>
      <br/>
      <br/>
      <Link to="/ex7">
        <button>Exercice 7: Programmation Orientée Objet (Formes géométriques)</button>
      </Link>
      <br/>
      <br/>
      <Link to="/ex8">
        <button>Exercice 8: Utilisation des variables globales (msg.sender et msg.value)</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ex1" element={<Ex1 />} />
        <Route path="/ex2" element={<Ex2 />} />
        <Route path="/ex3" element={<Ex3 />} />
        <Route path="/ex4" element={<Ex4 />} />
        <Route path="/ex5" element={<Ex5 />} />
        <Route path="/ex6" element={<Ex6 />} />
        <Route path="/ex7" element={<Ex7 />} />
        <Route path="/ex8" element={<Ex8 />} />
      </Routes>
    </Router>
  );
}

export default App;
