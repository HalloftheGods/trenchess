export const generateRoomCode = (length = 4): string => {
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  const randomCharacters = Array.from({ length }, () => {
    const entropy = Math.random() * characters.length;
    const randomIndex = Math.floor(entropy);
    return characters.charAt(randomIndex);
  });

  return randomCharacters.join("");
};
