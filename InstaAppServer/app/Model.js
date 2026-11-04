const tags = [
  "#love",
  "#instagood",
  "#fashion",
  "#instagram",
  "#photooftheday",
  "#art",
  "#photography",
  "#beautiful",
  "#nature",
  "#picoftheday",
  "#travel",
  "#happy",
  "#cute",
  "#instadaily",
  "#style",
  "#tbt",
  "#repost",
  "#followme",
  "#summer",
  "#reels",
  "#like4like",
  "#beauty",
  "#fitness",
  "#food",
];

const tagsObjects = tags.map((name, id) => ({
  id,
  name,
  popularity: parseInt(Math.random() * 500).toFixed(),
}));

export { tags, tagsObjects };
