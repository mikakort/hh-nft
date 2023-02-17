const { assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT tests", function () {
          let basicNft, deployer;

          beforeEach(async () => {
              accounts = await ethers.getSigners();
              deployer = accounts[0];
              await deployments.fixture(["basicnft"]);
              basicNft = await ethers.getContract("BasicNft");
          });

          describe("Constructor", () => {
              it("Inits the nft correctly", async function () {
                  const name = await basicNft.name();
                  const symbol = await basicNft.symbol();
                  const tokenCounter = await basicNft.getTokenCounter();
                  assert.equal(name, "Dogie");
                  assert.equal(symbol, "DOG");
                  assert.equal(tokenCounter.toString(), "0");
              });
          });

          describe("mintNft", () => {
              beforeEach(async () => {
                  const tx = await basicNft.mintNft();
                  await tx.wait(1);
              });

              it("Updates token Counter and keeps the same tokenURI", async function () {
                  const tokenCounter = await basicNft.getTokenCounter();
                  const tokenURI = await basicNft.tokenURI(0);

                  assert.equal(tokenCounter.toString(), "1");
                  assert.equal(tokenURI, await basicNft.TOKEN_URI());
              });

              it("Deployer's balance updates", async () => {
                  const deployerAddress = deployer.address;
                  const deployerBalance = await basicNft.balanceOf(deployerAddress);
                  const owner = await basicNft.ownerOf("0");

                  assert.equal(deployerBalance.toString(), "1");
                  assert.equal(deployerAddress, owner);
              });
          });
      });
