<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerador de Voucher</title>
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
    </style>
</head>
<body>
    <h1>Gerador de Voucher</h1>
    <input type="text" id="cpf" placeholder="Digite seu CPF" />
    <button onclick="generateVoucher()">Gerar Voucher</button>
    <div id="message" class="message"></div>

    <script>
        function generateVoucher() {
            const cpfInput = document.getElementById('cpf').value;
            const messageDiv = document.getElementById('message');

            if (!isValidCPF(cpfInput)) {
                messageDiv.textContent = 'CPF inválido. Por favor, insira um CPF válido.';
                return;
            }

            const storedData = JSON.parse(localStorage.getItem('voucherData')) || { generatedVouchers: {}, unvalidatedVouchers: {}, validatedVouchers: {} };
            
            if (storedData.generatedVouchers[cpfInput]) {
                messageDiv.textContent = 'Oops, você já gerou o seu voucher.';
                return;
            }

            if (Object.keys(storedData.unvalidatedVouchers).length >= 10) {
                messageDiv.textContent = 'Limite de vouchers não validados atingido.';
                return;
            }

            const voucherCode = 'connect' + cpfInput.slice(0, 3) + Math.random().toString(36).substring(2, 4);
            storedData.generatedVouchers[cpfInput] = voucherCode;
            storedData.unvalidatedVouchers[voucherCode] = cpfInput;

            localStorage.setItem('voucherData', JSON.stringify(storedData));

            messageDiv.textContent = 'Seu voucher é: ' + voucherCode;
        }

        function isValidCPF(cpf) {
            cpf = cpf.replace(/\D/g, '');
            if (cpf.length !== 11) return false;
            if (/^(\d)\1+$/.test(cpf)) return false;

            let sum = 0;
            let remainder;

            // Validate first digit
            for (let i = 1; i <= 9; i++) {
                sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(9))) return false;

            // Validate second digit
            sum = 0;
            for (let i = 1; i <= 10; i++) {
                sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(10))) return false;

            return true;
        }
    </script>
</body>
</html>
