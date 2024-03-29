#!/bin/bash

# Starting the network, creating a channel, and joining Org3 to the network
echo "Setting up the network and creating a channel..."
./network.sh up createChannel -c mychannel -ca
echo "Deploying chaincode..."

echo "Adding Org3 to the network..."
cd addOrg3
./addOrg3.sh up -c mychannel
cd ..

# Deploy the chaincode
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript

# Invoking chaincode to query all data
echo "Invoking chaincode to query all data..."
peer chaincode query -C mychannel -n basic -c '{"Args":["getAllData","\"ad\""]}'
