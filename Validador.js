<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validador de Voucher</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
        input[type="text"] {
            padding: 10px;
            margin: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 80%;
            max-width: 300px;
        }
        button {
            background-color: #ef4b76;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #d43f6c;
        }
        .message {
            margin-top: 20px;
            font-weight: bold;
        }
        .voucher-list {
            margin-top: 20px;
            text-align: left;
            display: inline-block;
            width: 100%;
            max-width: 600px;
        }
        .voucher-list div {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>Validador de Voucher</h1>
    <input type="text" id="voucherCode" placeholder="Digite o código do voucher" />
    <button onclick="validateVoucher()">Validar Voucher</button>
    <div id="message" class="message"></div>

    <h2>Vouchers Validados</h2>
    <div id="validatedVouchers" class="voucher-list"></div>

    <h2>Vouchers Não Validados</h2>
    <div id="unvalidatedVouchers" class="voucher-list"></div>

    <script>
        function validateVoucher() {
            const voucherCodeInput = document.getElementById('voucherCode').value;
            const messageDiv = document.getElementById('message');

            const storedData = JSON.parse(localStorage.getItem('voucherData')) || { generatedVouchers: {}, unvalidatedVouchers: {}, validatedVouchers: {} };
            
            if (!storedData.unvalidatedVouchers[voucherCodeInput]) {
                messageDiv.textContent = 'Voucher inválido ou já utilizado.';
                return;
            }

            messageDiv.textContent = 'Voucher validado com sucesso!';

            const cpf = storedData.unvalidatedVouchers[voucherCodeInput];
            delete storedData.unvalidatedVouchers[voucherCodeInput];
            storedData.validatedVouchers[voucherCodeInput] = cpf;

            if (Object.keys(storedData.validatedVouchers).length > 10) {
                const oldestKey = Object.keys(storedData.validatedVouchers)[0];
                delete storedData.validatedVouchers[oldestKey];
            }

            localStorage.setItem('voucherData', JSON.stringify(storedData));

            updateVoucherLists();
        }

        function updateVoucherLists() {
            const validatedVouchersDiv = document.getElementById('validatedVouchers');
            const unvalidatedVouchersDiv = document.getElementById('unvalidatedVouchers');

            validatedVouchersDiv.innerHTML = '';
            unvalidatedVouchersDiv.innerHTML = '';

            const storedData = JSON.parse(localStorage.getItem('voucherData')) || { validatedVouchers: {}, unvalidatedVouchers: {} };

            const validatedKeys = Object.keys(storedData.validatedVouchers || {});
            const unvalidatedKeys = Object.keys(storedData.unvalidatedVouchers || {});

            validatedKeys.forEach(voucher => {
                validatedVouchersDiv.innerHTML += `<div>${storedData.validatedVouchers[voucher]} - ${voucher}</div>`;
            });

            unvalidatedKeys.forEach(voucher => {
                unvalidatedVouchersDiv.innerHTML += `<div>${storedData.unvalidatedVouchers[voucher]} - ${voucher}</div>`;
            });
        }

        window.addEventListener('storage', updateVoucherLists);
        updateVoucherLists();
    </script>
</body>
</html>
