// Importe as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Configuração do seu aplicativo Firebase
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "gerador-de-voucher-acpo.firebaseapp.com",
  projectId: "gerador-de-voucher-acpo",
  storageBucket: "gerador-de-voucher-acpo.appspot.com",
  messagingSenderId: "681881231229",
  appId: "1:681881231229:web:a9253b4a9e061f49247614",
  measurementId: "G-QZXXSNR3HL"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para gerar um voucher
function gerarVoucher(cpf) {
  // Lógica para gerar um código de voucher baseado no CPF
  const codigoVoucher = `Connect${cpf.substring(0, 4)}${gerarLetrasAleatorias(2)}`;

  // Salvar o código no Firestore do Firebase
  const docRef = doc(db, "vouchers", cpf);
  setDoc(docRef, {
    codigo: codigoVoucher,
    geradoEm: new Date()
  });

  return codigoVoucher;
}

// Função para gerar letras aleatórias
function gerarLetrasAleatorias(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
