# 🔐 Secure Crypto Marketplace

Uma plataforma de marketplace completamente descentralizada com contratos inteligentes Solidity, frontend React, chat P2P criptografado e Zero-Knowledge Proofs para anonimato de usuários.

## ✨ Funcionalidades

### Smart Contracts
- **MarketplaceEscrow.sol** - Mecanismo seguro de escrow mantendo fundos até confirmação de entrega
- **ZKProofValidator.sol** - Validação de Zero-Knowledge Proofs para anonimato do usuário
- **MarketplaceToken.sol** - Token ERC20 para transações do marketplace

### Funcionalidades Principais
- ✅ Registro de vendedores e compradores com identificadores anônimos
- ✅ Listagem de produtos com metadados IPFS
- ✅ Criação segura de pedidos com escrow automático
- ✅ Confirmação de entrega e liberação de fundos
- ✅ Mecanismo de resolução de disputas
- ✅ Comissão de plataforma de 0.5% automaticamente deduzida
- ✅ Pagamento exclusivamente em ETH

### Recursos de Segurança
- 🔒 Proteção ReentrancyGuard
- 🔒 Mecanismo de pausa de emergência
- 🔒 Contratos auditados OpenZeppelin
- 🔒 Zero-Knowledge Proofs para privacidade
- 🔒 Chat P2P criptografado end-to-end
- 🔒 Rastreamento de transações anônimo

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- MetaMask wallet
- ETH para taxas de gas

### Instalação

```bash
git clone https://github.com/gabriellucassantossilva14-cpu/secure-cripto-marktplace.git
cd secure-cripto-marktplace
npm install
