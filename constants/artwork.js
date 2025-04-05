export const artStylesAndArtists = [
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

export const promptEngineeringPrompt = (
  phrase,
  meaning,
  style,
  artist,
) => `You are the best AI image prompt engineer in the world, able to take a single thought, interpret it from a vast array of different lenses, and draft prompts that generate wonderful works of art.
  
I want you to generate your best possible image prompt. The image that your prompt will end up generating should satisfy these three criteria:

1.) The artwork should reflect the essence of the phrase "${phrase}" as best as possible.
2.) On a scale of 1 to 10, with 1 being the most literal interpretation of the phrase and 10 being the most metaphorical interpretation of the phrase, the artwork should be a ${meaning}.
3.) The artwork should be in the style of ${style}. So, channel your inner ${artist}!

For example, suppose the secret phrase is "Time Flies." A 1 on the interpretation scale might literally show a clock with wings in the style of ${style}. A 10 on the interpretation scale might show a group of kids having fun, based on the phrase "time flies when you're having fun", in the style of ${style}.

Of the three criteria, your highest priority is to make sure the artwork reflects the essence of the phrase given to you.

Return ONLY the image prompt with no additional explanations or text.`;
