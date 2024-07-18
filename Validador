// Importe as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, collection, getDocs } from "firebase/firestore";

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

// Função para validar um voucher
async function validarVoucher(codigo) {
  // Consultar o Firestore para verificar se o voucher é válido
  const querySnapshot = await getDocs(collection(db, "vouchers"));
  let valido = false;

  querySnapshot.forEach((doc) => {
    if (doc.data().codigo === codigo) {
      valido = true;
      // Atualizar o status do voucher para marcá-lo como utilizado
      const docRef = doc(db, "vouchers", doc.id);
      updateDoc(docRef, {
        utilizado: true
      });
    }
  });

  return valido;
}
