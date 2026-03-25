// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKProofValidator is Ownable {
    struct ZKProof {
        bytes32 proofHash;
        address prover;
        uint256 timestamp;
        bool isValid;
        uint256 expiresAt;
    }
    
    mapping(address => ZKProof) public proofs;
    mapping(bytes32 => bool) public usedProofs;
    
    uint256 constant PROOF_VALIDITY_PERIOD = 30 days;
    
    event ProofStored(address indexed prover, bytes32 proofHash);
    event ProofVerified(address indexed prover, bool isValid);
    
    function storeProof(bytes32 proofHash) external {
        ZKProof memory newProof = ZKProof({
            proofHash: proofHash,
            prover: msg.sender,
            timestamp: block.timestamp,
            isValid: true,
            expiresAt: block.timestamp + PROOF_VALIDITY_PERIOD
        });
        
        proofs[msg.sender] = newProof;
        usedProofs[proofHash] = true;
        
        emit ProofStored(msg.sender, proofHash);
    }
    
    function verifyAnonymityProof(address prover) external view returns (bool) {
        ZKProof memory proof = proofs[prover];
        
        if (!proof.isValid) return false;
        if (block.timestamp > proof.expiresAt) return false;
        if (proof.proofHash == bytes32(0)) return false;
        
        return true;
    }
    
    function hasValidProof(address prover) external view returns (bool) {
        ZKProof memory proof = proofs[prover];
        
        if (!proof.isValid) return false;
        if (block.timestamp > proof.expiresAt) {
            return false;
        }
        
        return true;
    }
    
    function getProofStatus(address prover) external view returns (
        bool isValid,
        uint256 expiresAt,
        uint256 age
    ) {
        ZKProof memory proof = proofs[prover];
        return (proof.isValid, proof.expiresAt, block.timestamp - proof.timestamp);
    }
    
    function invalidateProof(address prover) external onlyOwner {
        proofs[prover].isValid = false;
    }
}
