export const generateRoomCode = (length = 4): string => {
  const alphanumericAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  const randomCharacters = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * alphanumericAlphabet.length);
    return alphanumericAlphabet.charAt(randomIndex);
  });

  return randomCharacters.join("");
};
