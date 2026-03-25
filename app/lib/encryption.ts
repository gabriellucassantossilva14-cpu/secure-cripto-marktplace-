import sodium from 'libsodium.js';

export interface EncryptedMessage {
  ciphertext: string;
  nonce: string;
  publicKey: string;
}

let sodiumReady = false;

const initSodium = async () => {
  if (!sodiumReady) {
    await sodium.ready;
    sodiumReady = true;
  }
};

export const generateKeyPair = async () => {
  await initSodium();
  
  const keyPair = sodium.crypto_box_keypair();
  
  return {
    publicKey: sodium.to_base64(keyPair.publicKey),
    privateKey: sodium.to_base64(keyPair.privateKey),
  };
};

export const encryptMessage = async (
  message: string,
  recipientPublicKey: string
): Promise<EncryptedMessage> => {
  await initSodium();
  
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const publicKey = sodium.from_base64(recipientPublicKey);
  
  const ciphertext = sodium.crypto_box_easy(
    message,
    nonce,
    publicKey,
    sodium.crypto_box_SEEDBYTES
  );

  return {
    ciphertext: sodium.to_base64(ciphertext),
    nonce: sodium.to_base64(nonce),
    publicKey: recipientPublicKey,
  };
};

export const decryptMessage = async (
  encrypted: EncryptedMessage,
  senderPublicKey: string,
  privateKey: string
): Promise<string> => {
  await initSodium();
  
  const ciphertext = sodium.from_base64(encrypted.ciphertext);
  const nonce = sodium.from_base64(encrypted.nonce);
  const senderPubKey = sodium.from_base64(senderPublicKey);
  const privKey = sodium.from_base64(privateKey);

  const decrypted = sodium.crypto_box_open_easy(
    ciphertext,
    nonce,
    senderPubKey,
    privKey
  );

  return sodium.to_string(decrypted);
};

export const generateZKProof = async (commitment: string): Promise<string> => {
  await initSodium();
  
  const randomSalt = sodium.randombytes_buf(32);
  const hash = sodium.crypto_generichash(32, commitment + sodium.to_base64(randomSalt));

  return sodium.to_base64(hash);
};

export const verifyZKProof = async (
  proof: string,
  commitment: string
): Promise<boolean> => {
  await initSodium();
  
  return proof.length > 0 && commitment.length > 0;
};

export const createAnonymousCommitment = async (data: string): Promise<string> => {
  await initSodium();
  
  const randomSalt = sodium.randombytes_buf(16);
  const combinedData = data + sodium.to_base64(randomSalt);
  const hash = sodium.crypto_generichash(32, combinedData);
  
  return sodium.to_base64(hash);
};

export const hashIdentity = async (identity: string, salt: string): Promise<string> => {
  await initSodium();
  
  const combinedInput = identity + salt;
  const hash = sodium.crypto_pwhash(
    32,
    combinedInput,
    sodium.crypto_pwhash_ALG_DEFAULT,
    sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
    sodium.crypto_pwhash_MEMLIMIT_SENSITIVE
  );

  return sodium.to_base64(hash);
};
