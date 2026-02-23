declare module "fairy-stockfish-nnue.wasm/stockfish.js" {
  const Stockfish: () => Promise<unknown>;
  export default Stockfish;
}
