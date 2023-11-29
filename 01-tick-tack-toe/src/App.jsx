
import './App.css'
import {useState} from 'react'
import confetti from 'canvas-confetti'
import {Square} from './components/Square'
import {TURNS} from './constants'
import {WinnerModal} from './components/WinnerModal'
import {checkWinner} from './logic/board'
function App() {

  const [board, setBoard] = useState(() =>{
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  } )

  const [turn, setTurn] = useState(() =>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? JSON.parse(turnFromStorage) : TURNS.X
  }
  )

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

    const updateBoard = (index) => {
      //no hay que actualizar si ya tiene algo
      if(board[index] || winner ) return
      //actualizamos
      const newBoard = [...board]
      newBoard[index] = turn
      setBoard(newBoard)
      //cambio de turno
      const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
      setTurn(newTurn)
      //guardar aqui partida
      window.localStorage.setItem('board', JSON.stringify(newBoard))
      window.localStorage.setItem('turn', JSON.stringify(newTurn))
      //comprobar si hay ganador
      const newWinner = checkWinner(newBoard)
      if(newWinner) {
        setWinner(newWinner)
        confetti()
  
      }else if(checkEndGame(newBoard) ){
        setWinner(false) //empate
      }
    }
    const checkEndGame = (newBoard) => {
      return newBoard.every((square) => square !== null)
      }

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}> Reset game</button>
      <section className='game'>
        {
          board.map((_, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  )
}

export default App
