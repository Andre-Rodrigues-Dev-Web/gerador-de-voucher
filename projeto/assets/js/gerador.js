// Importe as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
async function gerarVoucher(cpf) {
  try {
    // Verificar se já existe um voucher para este CPF
    const docRef = doc(db, "vouchers", cpf);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("CPF já registrado:", docSnap.data().codigo);
      return null; // Retorna null ou uma mensagem indicando que o CPF já está registrado
    } else {
      // Lógica para gerar um código de voucher baseado no CPF
      const codigoVoucher = `Connect${cpf.substring(0, 4)}${gerarLetrasAleatorias(2)}`;

      // Salvar o novo código no Firestore do Firebase
      await setDoc(docRef, {
        codigo: codigoVoucher,
        geradoEm: new Date()
      });

      // Salvar o voucher no localStorage
      const storedData = JSON.parse(localStorage.getItem("voucherData")) || {
        generatedVouchers: {},
        unvalidatedVouchers: {},
        validatedVouchers: {},
      };
      storedData.unvalidatedVouchers[codigoVoucher] = cpf;
      localStorage.setItem("voucherData", JSON.stringify(storedData));

      console.log("Novo voucher gerado:", codigoVoucher);
      return codigoVoucher;
    }
  } catch (error) {
    console.error("Erro ao gerar voucher:", error);
  }
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

// Função para capturar o CPF do input e chamar gerarVoucher
function handleGenerateVoucher() {
  const cpf = document.getElementById('voucherCode').value;
  gerarVoucher(cpf).then(voucher => {
    if (voucher) {
      console.log("Voucher gerado:", voucher);
      updateVoucherLists();
    } else {
      console.log("CPF já possui um voucher registrado.");
    }
  }).catch(error => {
    console.error("Erro ao gerar voucher:", error);
  });
}

// Função para validar o voucher
function validateVoucher() {
  const voucherCodeInput = document.getElementById("voucherCode").value;
  const messageDiv = document.getElementById("message");

  const storedData = JSON.parse(localStorage.getItem("voucherData")) || {
    generatedVouchers: {},
    unvalidatedVouchers: {},
    validatedVouchers: {},
  };

  if (!storedData.unvalidatedVouchers[voucherCodeInput]) {
    messageDiv.textContent = "Voucher inválido ou já utilizado.";
    return;
  }

  messageDiv.textContent = "Voucher validado com sucesso!";

  const cpf = storedData.unvalidatedVouchers[voucherCodeInput];
  delete storedData.unvalidatedVouchers[voucherCodeInput];
  storedData.validatedVouchers[voucherCodeInput] = cpf;

  if (Object.keys(storedData.validatedVouchers).length > 10) {
    const oldestKey = Object.keys(storedData.validatedVouchers)[0];
    delete storedData.validatedVouchers[oldestKey];
  }

  localStorage.setItem("voucherData", JSON.stringify(storedData));

  updateVoucherLists();
}

// Função para atualizar as listas de vouchers validados e não validados
function updateVoucherLists() {
  const validatedVouchersDiv = document.getElementById("validatedVouchers");
  const unvalidatedVouchersDiv = document.getElementById("unvalidatedVouchers");

  validatedVouchersDiv.innerHTML = "";
  unvalidatedVouchersDiv.innerHTML = "";

  const storedData = JSON.parse(localStorage.getItem("voucherData")) || {
    validatedVouchers: {},
    unvalidatedVouchers: {},
  };

  const validatedKeys = Object.keys(storedData.validatedVouchers || {});
  const unvalidatedKeys = Object.keys(storedData.unvalidatedVouchers || {});

  validatedKeys.forEach((voucher) => {
    validatedVouchersDiv.innerHTML += `<div>${storedData.validatedVouchers[voucher]} - ${voucher}</div>`;
  });

  unvalidatedKeys.forEach((voucher) => {
    unvalidatedVouchersDiv.innerHTML += `<div>${storedData.unvalidatedVouchers[voucher]} - ${voucher}</div>`;
  });
}

window.addEventListener("storage", updateVoucherLists);
updateVoucherLists();
