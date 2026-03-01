declare module "stockfish.js" {
  export default function StockfishJs(): {
    addMessageListener?: (cb: (line: string) => void) => void;
    postMessage: (msg: string) => void;
    onmessage?: (event: { data: string } | string) => void;
  };
}
