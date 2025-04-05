"use strict";

import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";
import { uploadFile } from "@uploadcare/upload-client";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const artStylesAndArtists = [
  { style: "impressionism", artist: "Claude Monet" },
  { style: "cubism", artist: "Pablo Picasso" },
  { style: "surrealism", artist: "Salvador Dali" },
  { style: "pop art", artist: "Andy Warhol" },
  { style: "abstract expressionism", artist: "Jackson Pollock" },
  { style: "minimalism", artist: "Agnes Martin" },
  { style: "baroque", artist: "Caravaggio" },
  { style: "renaissance", artist: "Leonardo da Vinci" },
  { style: "romanticism", artist: "Caspar David Friedrich" },
  { style: "pointillism", artist: "Georges Seurat" },
  { style: "art nouveau", artist: "Alphonse Mucha" },
  { style: "ukiyo-e", artist: "Hokusai" },
  { style: "fauvism", artist: "Henri Matisse" },
  { style: "realism", artist: "Gustave Courbet" },
  { style: "photorealism", artist: "Chuck Close" },
];

async function generateImage(phrase, meaning, style, artist) {
  const promptEngineeringPrompt = `You are the best AI image prompt engineer in the world, able to take a single thought, interpret it from a vast array of different lenses, and draft prompts that generate wonderful works of art.
  
I want you to generate your best possible image prompt. The image that your prompt will end up generating should satisfy these three criteria:

1.) The artwork should reflect the essence of the phrase "${phrase}" as best as possible.
2.) On a scale of 1 to 10, with 1 being the most literal interpretation of the phrase and 10 being the most metaphorical interpretation of the phrase, the artwork should be a ${meaning}.
3.) The artwork should be in the style of ${style}. So, channel your inner ${artist}!

For example, suppose the secret phrase is "Time Flies." A 1 on the interpretation scale might literally show a clock with wings in the style of ${style}. A 10 on the interpretation scale might show a group of kids having fun, based on the phrase "time flies when you're having fun", in the style of ${style}.

Of the three criteria, your highest priority is to make sure the artwork reflects the essence of the phrase given to you.

Return ONLY the image prompt with no additional explanations or text.`;

  try {
    const promptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a skilled image prompt engineer." },
        { role: "user", content: promptEngineeringPrompt },
      ],
    });

    const imagePrompt = promptResponse.choices[0].message.content.trim();
    console.log(`Generated image prompt: ${imagePrompt}`);

    const response = await openai.images.generate({
      prompt: imagePrompt,
      model: "dall-e-3",
      quality: "hd",
      style: "vivid",
      n: 1,
    });

    const imageUrl = response.data[0].url;

    const uploadResult = await uploadFile(imageUrl, {
      publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY,
      store: "auto",
      metadata: {
        source: "openai",
        prompt: phrase,
        meaning: meaning.toString(),
        style,
        artist,
        generatedPrompt: imagePrompt,
      },
    });

    return uploadResult.cdnUrl;
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    throw error;
  }
}

async function generateDailyGame() {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.error("Please provide a secret phrase as an argument");
      process.exit(1);
    }

    const secretPhrase = args.join(" ");

    const imageUrls = [];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(
        Math.random() * artStylesAndArtists.length,
      );
      const { style, artist } = artStylesAndArtists[randomIndex];

      const meaning = Math.floor(Math.random() * 10) + 1;

      console.log(`Image ${i + 1}:`);
      console.log(`  Style: ${style}`);
      console.log(`  Artist: ${artist}`);
      console.log(`  Meaning: ${meaning}`);
      console.log("--------------------------------");

      const imageUrl = await generateImage(
        secretPhrase,
        meaning,
        style,
        artist,
      );
      imageUrls.push(imageUrl);
    }

    await prisma.game.create({
      data: {
        prompt: secretPhrase,
        image1: imageUrls[0],
        image2: imageUrls[1],
        image3: imageUrls[2],
      },
    });
  } catch (error) {
    console.error("Error in generate daily game:", error);
  } finally {
    await prisma.$disconnect();
  }
}

generateDailyGame();
