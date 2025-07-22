import { useState, useCallback, useMemo } from "react";

export default function Home() {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const lines = useMemo(() => [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ], []);

  const calculateWinner = useCallback((squares: Array<string | null>) => {
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, [lines]);

  const winner = useMemo(() => calculateWinner(board), [board, calculateWinner]);
  const isDraw = useMemo(() => !winner && board.every(square => square !== null), [winner, board]);

  const handleClick = useCallback((index: number) => {
    if (winner || board[index] || isDraw) {
      return;
    }
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[index] = isXNext ? "X" : "O";
      return newBoard;
    });
    setIsXNext(prev => !prev);
  }, [winner, board, isDraw, isXNext]);

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }, []);

  const getSquareColor = (square: string | null) => {
    if (!square) return "text-gray-400";
    return square === "X" ? "text-blue-600" : "text-red-500";
  };

  const getStatusMessage = () => {
    if (winner) return `🎉 Winner: ${winner}`;
    if (isDraw) return "🤝 It's a draw!";
    return `Next Player: ${isXNext ? "X" : "O"}`;
  };

  const getStatusColor = () => {
    if (winner) return "text-green-600";
    if (isDraw) return "text-yellow-600";
    return "text-gray-700";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={winner !== null || isDraw || square !== null}
              className={`
                w-20 h-20 text-4xl font-bold rounded-xl transition-all duration-200 
                border-2 border-gray-200 hover:border-gray-300
                ${square ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'} 
                ${getSquareColor(square)}
                disabled:cursor-not-allowed
                hover:shadow-md hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
              aria-label={`Square ${index + 1}${square ? `, filled with ${square}` : ', empty'}`}
            >
              {square}
            </button>
          ))}
        </div>

        <div className={`text-center text-xl font-semibold mb-6 ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>

        <button
          className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
          onClick={reset}
        >
          🔄 Reset Game
        </button>
      </div>
    </div>
  );
}
