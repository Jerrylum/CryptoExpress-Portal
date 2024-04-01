<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->

## Introduction

CryptoExpress-Portal is a web-based portal that harnesses the capabilities of Hyperledger Fabric to establish a private blockchain system dedicated to manage goods delivery. It allow to set up a web portal on any device with a web browser, including desktops, laptops, tablets, and mobile phones.

It is a powerful and flexible multi-purpose delivery route manager/planner, which allows users to manage addresses/couriers/routes status by calling the chaincode to update the channel.

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

### Route Segment
A segment is a pair of a stop and a transport, which represents the delivery detail between two stops. 

### Company
An entity that has a set of internal couriers and addresses.

### Courier
Courier serves to identify a courier for transportation of the delivery, including fields for the courier's name, company, telephone number, and a public key for secure communication. Furthermore, each company maintains its own internal database to store couriers

### Address
Address consists of street lines, recipient name, and asymmetric key for digital signature. It serves to identify a physical location associated with one or more company entities. Each company maintains its own internal database to store addresses, accompanied by a private key to maintain the ownership. 

Upon the creation of a new address, it is stored in the internal database. Upon the creation of a new address, it is stored within the internal database. The entity can then make the address public by sharing it without the private key, thereby making it accessible to all parties.

When submitting a new route by constructing a route proposal, the source and destination address will be selected from the address book. After the route proposal is created which an address is involved, the address must sign the route proposal with its private key to confirm the acknowledgment of the route.

### Address Book & Courier List
The Address Book and Courier List are comprehensive collections that encompass both internal and external entities. 

Internal entities, whether addresses or couriers, are retrieved from an internal database and must be accompanied by a private key for ownership verification and signing purposes. 

External entities, accessed via chaincode, are provided with only a public key, enabling signature validation for the corresponding entity. This dual approach ensures secure and authenticated interactions within the system, facilitating the identification and verification of both addresses and couriers.


### Good
<!-- An item or product with a unique identifier (UUID), name, and barcode. For all goods data will be stored in the internal database for the company. -->
Good is used to define a trade item as products or services that are being referred to in the delivery process. It has a unique identifier (UUID), name, and barcode. Each company has its own internal database to store the goods data. When creating a new route, the goods will be selected from the internal database. Therefore, the UUID must be unique under the company and route.

Good serves as a reference to the actual product or service that is being delivered. A record in the internal database doesn't mean the actual product or service is in the warehouse or store, nor does it mean the product or service is owned by the company.

The barcode is used to identify the product or service in the real world during the check in and check out process. Global Trade Item Number (GTIN) can be used as the barcode to uniquely identify all the goods.

### Stop
A stop describe the delivery detail for a specific address on a route with fields for the corresponding address (as a hash ID), expected arrival timestamp, input and output goods (as a map of UUIDs to quantities), and a reference to the next transport in the route.

### Transport
A transport describe the delivery detail for a specific transportation event on a route with fields for the courier (as a hash ID), additional information, and the destination stop.


## Channel Standard
In the global shared status(channel), we have set up standards for the key map with the object stored. For detail, please see the readme file at [CryptoExpress-ChainCode](https://github.com/Jerrylum/CryptoExpress-Chaincode)


## Features

- Manage Route on the channel
  - Create new route proposal
  - Remove a route proposal
  - Sign route proposal with a internal private key
  - Submit a completely signed route proposal
  - Commit a progress
- Manage Addresses on the channel
  - Create a new Address
  - Remove a existing Address
- Manage Couriers on the channel
  - Create a new Courier
  - Remove a existing Courier

## Getting Started

### Pre-requisites

### Pull Network Repo & Chaincode

### Setup Development Network

### Deploy Chaincode to the Development Network

### Run the Portal

## Usage
