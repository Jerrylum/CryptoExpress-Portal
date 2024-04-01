## Introduction

CryptoExpress-Portal is a web-based portal that harnesses the capabilities of Hyperledger Fabric to establish a private blockchain system dedicated to manage goods delivery. It allow to set up a web portal on any device with a web browser, including desktops, laptops, tablets, and mobile phones.

It is a powerful and flexible multi-purpose delivery route manager/planner, which allows users to manage addresses/couriers/routes status by calling the chaincode to update the world state.

## Glossary

### Route Proposal

A proposal for a route, including the route itself and signatures from the involved addresses/couriers as a map of hash IDs to signatures. This signature will be the route signed by the private key of the corresponding party and the proposal can only be submit once collected all involved party's signature.

### Proposal Signature

To initiate the creation of a route, a route proposal must first be established. This proposal encompasses essential route details, including the source and destination addresses, the courier responsible for the delivery, the goods to be delivered, and the expected delivery timeline.

After a route proposal is created, the route proposal needs to be signed by all involved entities. This includes all addresses associated with the stops and the couriers assigned to each transport. The necessity for this signature process stems from the requirement to ensure that every entity involved has consented to the route's specifics.

The signing of the route proposal is executed using the private key of the corresponding entity, thereby confirming their acknowledgment and agreement with the route's details. It is crucial for all involved entities to sign the proposal to validate their consent and to ensure the route's legitimacy.

Upon the completion of the signature process by all involved entities, the route proposal can then be officially submitted.

### Route

A route consists of a series of stops and transports, which represent a real-world good delivering routine from a source address to multiple destination address involving multiple couriers. Each stop may have multiple import and export goods, and multiple couriers are responsible for the transportation between stops.

### Company

An entity that has a set of internal couriers and addresses.

### Address/Courier Ownership

Any company that have the an address/courier with correct private key in their internal database means they own this specific address/courier.

### Address & Courier

Courier and Address both serve as identifiers within the system, with the Courier focusing on the transportation courier and the Address representing on physical locations. Each entity is stored in an internal database of the company, accompanied by a private key for ownership verification.

Upon creation, both created address/courier are stored in the internal database and can be made public by sharing them without the private key via chaincode, making them accessible to all entities in the blockchain network.

When constructing a route proposal, address and courier are selected from the courier list (for Transport) and address book (for Stop). The proposal then need to be signed with the corresponding private key to confirm acknowledgment of the route by the corresponding company, whose own the set of private key of the involved addresses and couriers. This ensures secure and authenticated agreement and consensus with the route's details, facilitating the identification and verification of both couriers and addresses within the system.

### Address Book & Courier List

The Address Book and Courier List are comprehensive collections that encompass both internal and external entities.

Internal entities, whether addresses or couriers, are retrieved from an internal database and must be accompanied by a private key for ownership verification and signing purposes.

External entities, accessed via chaincode to read from the world state, are provided with only a public key, enabling signature validation for the corresponding entity. This dual approach ensures secure and authenticated interactions within the system, facilitating the identification and verification of both addresses and couriers.

### Good

Good is used to define a trade item as products or services that are being referred to in the delivery process. It has a unique identifier (UUID), name, and barcode. Each company has its own internal database to store the goods data. When creating a new route, the goods will be selected from the internal database. Therefore, the UUID must be unique under the company and route.

Good serves as a reference to the actual product or service that is being delivered. A record in the internal database doesn't mean the actual product or service is in the warehouse or store, nor does it mean the product or service is owned by the company.

The barcode is used to identify the product or service in the real world during the check in and check out process. Global Trade Item Number (GTIN) can be used as the barcode to uniquely identify all the goods.

### Route Segment

Segment is a pair of a stop and a transport, which represents the delivery detail between two stops.

### Stop

Stop describe the delivery detail for a specific address on a route with fields for the corresponding address (as a hash ID), expected arrival timestamp, input and output goods (as a map of UUIDs to quantities), and a reference to the next transport in the route.

### Transport

Transport describe the delivery detail for a specific transportation event on a route with fields for the courier (as a hash ID), additional information, and the destination stop.

### Commit

Commit describe a specific moment on the route for the delivery. The described moment can be status of source outgoing, courier receiving, courier delivering, and destination incoming. It encompasses details of the moment, including changes in goods quantities (delta), additional information, a timestamp indicating the actual time of this state, and a signature for the entity corresponding to the specific moment.

In practical scenarios, when the delivery reaches one of these four statuses in the real world, the company owning the corresponding entity (address/courier) signs the commit detail to ensure its identification, verification, and agreement. Subsequently, a commit marking the completion of this specific moment for the route is released via the chaincode by the company.

## World State Standard

In the world state, we have set up standards for the key map with the object stored. For detail, please see the readme file at [CryptoExpress-ChainCode](https://github.com/Jerrylum/CryptoExpress-Chaincode)

## Features

- Manage Route on the world state
  - Create new route proposal
  - Remove a route proposal
  - Sign route proposal with a internal private key
  - Submit a completely signed route proposal
  - Commit a progress
- Manage Addresses on the world state
  - Create a new Address
  - Remove a existing Address
- Manage Couriers on the world state
  - Create a new Courier
  - Remove a existing Courier

## Getting Started

### Pre-requisites

A Linux instance with at least 2 vCPUs, 4 GB RAM, and 4 GB storage. Linux distribution `Ubuntu 22.04.3 LTS` is used in this guide.

### Install Node.js

Run the following commands to install Node Version Manager (NVM) and Node.js 18.17.

```bash
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18.17
nvm use 18.17

# Update the symbolic links for node and npm
# This is to ensure that the correct version of node and npm are used
# It is necessary to run this command for the chaincode compilation later
sudo rm -f /usr/bin/node
sudo rm -f /usr/bin/npm
sudo ln -s $(which node) /usr/bin/
sudo ln -s $(which npm) /usr/bin/
```

### Pull Network Repo & Chaincode & Portal

Run the following commands to clone the CryptoExpress-Chaincode, CryptoExpress-Network, and CryptoExpress-Portal repositories.

```bash
cd ~
git clone https://github.com/Jerrylum/CryptoExpress-Chaincode.git
git clone https://github.com/Jerrylum/CryptoExpress-Network.git
git clone https://github.com/Jerrylum/CryptoExpress-Portal.git
```

### Setup Development Network

Run the following commands to setup the development network.

```bash
cd ~/CryptoExpress-Network
./install.sh
```

### Deploy Chaincode to the Development Network

```bash
cd ~/CryptoExpress-Network/test-network
./init.sh ~/CryptoExpress-Chaincode
```

### Run the Portal

Modify the `.env` file in the `CryptoExpress-Portal` directory to match the configuration of the development network.

```
COMPANY_NAME=Company A
CHANNEL_NAME=mychannel
CHAINCODE_NAME=basic
MSP_ID=Org1MSP
CRYPTO_PATH=/home/ubuntu/CryptoExpress-Network/test-network/organizations/peerOrganizations/org1.example.com
KEY_DIRECTORY_PATH="${CRYPTO_PATH}/users/User1@org1.example.com/msp/keystore"
CERT_PATH="${CRYPTO_PATH}/users/User1@org1.example.com/msp/signcerts/cert.pem"
TLS_CERT_PATH="${CRYPTO_PATH}/peers/peer0.org1.example.com/tls/ca.crt"
PEER_ENDPOINT=localhost:7051
PEER_HOST_ALIAS=peer0.org1.example.com
```

Run the following commands to start the portal.

```bash
cd ~/CryptoExpress-Portal
npm install
npm run dev
```

## Usage
