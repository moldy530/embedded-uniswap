function countDecimals(x: number) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}

export const fromReadableAmount = (
  amount: number,
  decimals: number
): bigint => {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = BigInt(amount * extraDigits);

  return (adjustedAmount * 10n ** BigInt(decimals)) / BigInt(extraDigits);
};
