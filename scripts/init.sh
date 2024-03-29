#!/bin/bash

# Starting the network, creating a channel, and joining Org3 to the network
echo "Setting up the network and creating a channel..."
./network.sh up createChannel -c mychannel -ca

echo "Deploying chaincode..."
./network.sh deployCC -ccn basic -ccp /home/ubuntu/CryptoExpress-Chaincode -ccl typescript

echo "Adding Org3 to the network..."
cd addOrg3
./addOrg3.sh up -c mychannel
cd ..

# Setting environment variables for Org3
echo "Configuring environment variables for Org3..."
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

# Installing chaincode on Org3's peer
echo "Installing chaincode on Org3's peer..."
peer lifecycle chaincode install basic.tar.gz

# Querying installed chaincodes to get the package ID
echo "Querying installed chaincodes to extract the package ID..."
output=$(peer lifecycle chaincode queryinstalled)
package_id=$(echo "$output" | grep "Package ID" | awk -F',' '{print $1}' | awk '{print $3}')
label=$(echo "$output" | grep "Package ID" | awk -F',' '{print $2}' | awk '{print $2}')

# Displaying the extracted package ID and label
echo "Get installed chaincodes on peer:"
echo "Package ID: $package_id, Label: $label"

# Exporting the package ID as an environment variable
export CC_PACKAGE_ID=$package_id
echo "Exported CC_PACKAGE_ID=$CC_PACKAGE_ID"

# Approving the chaincode definition for Org3
echo "Approving the chaincode definition for Org3..."
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --channelID mychannel --name basic --version 1.0.1 --package-id $CC_PACKAGE_ID --sequence 1

# Querying the committed chaincode definitions on the channel
echo "Querying the committed chaincode definitions on the channel..."
peer lifecycle chaincode querycommitted --channelID mychannel --name basic --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# Changing the permission of the organizations folder
echo "Changing the permission of the organizations folder..."
sudo chmod 777 -R ./organizations

# Invoking chaincode to query all data
echo "Invoking chaincode to query all data..."
peer chaincode query -C mychannel -n basic -c '{"Args":["getAllData","\"ad\""]}'
