const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    const files = fs.readdirSync(fullImagesPath).filter((file) => file.includes(".png"));
    let responses = [];
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`);
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        };
        try {
            const response = await pinata.pinFileToIPFS(
                pinataApiKey,
                pinataApiSecret,
                readableStreamForFile.path,
                options
            );
            responses.push(response);
        } catch (e) {
            console.log(e);
        }
    }
    return { responses, files };
}

module.exports = { storeImages };
