
import './App.css'
import {useState} from 'react'
import confetti from 'canvas-confetti'
import {Square} from './components/Square'
import {TURNS} from './constants'
import {WinnerModal} from './components/WinnerModal'
import {checkWinner, checkEndGame} from './logic/board'
import { resetGameFromStorage, saveGameStorage } from './logic/storage'
function App() {

  const [board, setBoard] = useState(() =>{
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage){
      return JSON.parse(boardFromStorage)
    }
    return Array(16).fill(null)
  }
  )
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    if(turnFromStorage){
      return turnFromStorage
    }
    return TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(16).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameFromStorage()
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
      saveGameStorage({
        board: newBoard,
        turn: newTurn
      })
      //comprobar si hay ganador
      const newWinner = checkWinner(newBoard)
      if (newWinner) {
        confetti()
        setWinner(newWinner)
      } else if (checkEndGame(newBoard)) {
        setWinner(false) // empate
      }
    }

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}> Reset game</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
