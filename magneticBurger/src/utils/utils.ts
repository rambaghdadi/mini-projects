export function transform(
  input: number,
  inputRange: number[],
  outputRange: number[],
  clamp = true,
) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;
  const ratio = (input - inputMin) / (inputMax - inputMin);
  let result = ratio * (outputMax - outputMin) + outputMin;

  if (clamp) {
    result = Math.max(
      Math.min(result, Math.max(outputMin, outputMax)),
      Math.min(outputMin, outputMax),
    );
  }

  return result;
}
