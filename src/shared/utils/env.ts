export const getServerUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) return import.meta.env.VITE_SERVER_URL;
  const { protocol, hostname } =
    typeof window !== "undefined"
      ? window.location
      : { protocol: "http:", hostname: "localhost" };
  if (hostname.includes("loca.lt"))
    return "https://battle-chess-server.loca.lt";
  return `${protocol}//${hostname}:3001`;
};
