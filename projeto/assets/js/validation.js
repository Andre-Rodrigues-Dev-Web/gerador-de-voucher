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
