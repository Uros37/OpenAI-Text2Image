import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';
import path from 'path';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 10,
      size: "256x256",
    });

    // let filepath = path.join(process.cwd(), `/public/house.png`);
    // const response = await openai.createImageVariation(
    //   fs.createReadStream(filepath),
    //   10,
    //   "256x256"
    // );

    // const response = await openai.createImageEdit(
    //   fs.createReadStream(path.join(process.cwd(), `/public/house.png`)),
    //   fs.createReadStream(path.join(process.cwd(), `/public/mask1.png`)),
    //   prompt,
    //   10,
    //   "256x256"
    // );
    // let image_url = response.data.data[0].url;

    let imageUrls = [];
    for(var d of response.data.data){
      imageUrls.push(d.url);
    }
    
    res.status(200).json({ result: imageUrls });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
