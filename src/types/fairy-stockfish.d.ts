declare module "fairy-stockfish-nnue.wasm/stockfish.js" {
  const Stockfish: () => Promise<any>;
  export default Stockfish;
}
