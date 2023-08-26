import React from "react";

const DailyPrompt = ({
  prompt,
  guessedLetters,
  isWinner,
  isLoser,
  reveal = false,
}) => {
  return (
    <div className="max-w-sm sm:max-w-md mx-auto">
      <div className="flex gap-1 tracking-wider text-xl font-extralight flex-wrap">
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

export default DailyPrompt;
