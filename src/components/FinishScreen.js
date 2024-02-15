function FinishScreen({ maxPossiblePoints, points, highScore }) {
  const percent = Math.ceil((points / maxPossiblePoints) * 100);
  let emoji;

  if (percent === 100) emoji = "🥇";
  if (percent >= 80 && percent < 100) emoji = "😉";
  if (percent >= 50 && percent < 80) emoji = "🤔";
  if (percent >= 0 && percent < 50) emoji = "💀";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        You scored {points} out of {maxPossiblePoints} ({percent} %)
      </p>
      <p className="highscore">Highscore : {highScore}</p>
    </>
  );
}

export default FinishScreen;
