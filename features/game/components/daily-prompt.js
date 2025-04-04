export const DailyPrompt = ({
  prompt = "Apple of My Eye",
  guessedLetters = [],
  isWinner = false,
  isLoser = false,
  reveal = false,
}) => {
  return (
    <div className="mx-auto max-w-sm sm:max-w-md">
      <div className="flex flex-wrap gap-1 text-xl font-extralight tracking-wider">
        {prompt?.split("").map((letter, index) => (
          <span
            style={{
              borderBottom:
                isWinner || isLoser || letter === " " ? "" : ".1em solid black",
            }}
            key={index}
          >
            <span
              style={{
                visibility:
                  guessedLetters.includes(letter) || reveal
                    ? "visible"
                    : "hidden",
                color:
                  !guessedLetters.includes(letter) && reveal
                    ? "#f43f5e"
                    : "#020617",
              }}
            >
              {letter === " " ? <span className="mr-2"></span> : letter}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
