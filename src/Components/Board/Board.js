import React, { useState, useEffect } from "react";

// Styles
import {
  Square,
  BoardContainer,
  BoardTitleContainer,
  BoardOutterContainer,
  ButtonsContainer,
  StartGameButton,
  RestartGameButton,
  ShootButton,
} from "./Board.styles";

const Board = () => {
  const [started, gameStarted] = useState(false);
  const [humanBoat, setHumanBoat] = useState();
  const [enemyBoat, setEnemyBoat] = useState();
  const [enemyBoatTwo, setEnemyBoatTwo] = useState();
  const [enemyBoatsHit, setEnemyBoatsHit] = useState([false, false]);
  const [enemyBoatRevealed, setEnemyBoatRevealed] = useState();
  const [enemyBoatRevealedTwo, setEnemyBoatRevealedTwo] = useState();
  const [attackPosition, setAttackPosition] = useState();
  const [squaresHumanAttacked, setSquaresHumanAttacked] = useState([]);
  const [squaresComputerAttacked, setSquaresComputerAttacked] = useState([]);
  const [humanWin, setHumanWin] = useState(false);
  const [computerWin, setComputerWin] = useState(false);

  useEffect(() => {
    checkHumanWin();
  });
  // Board Logic
  let board = [];
  for (let i = 1; i <= 100; i++) board.push(i);

  // Start the game && position Computer boat
  const startGame = () => {
    positionEnemyBoat();
    gameStarted(true);
  };

  // Human sets boat position
  const positionHumanBoat = (value) => {
    setHumanBoat(value);
  };

  // Randomly places enemy boat
  const positionEnemyBoat = () => {
    // NEED TO ENSURE CANNOT BE PLACED ONTO EACH OTHER
    const positionComputerBoat = Math.floor(Math.random() * 100) + 1;
    const positionComputerBoatTwo = Math.floor(Math.random() * 100) + 1;
    setEnemyBoat(positionComputerBoat);
    setEnemyBoatTwo(positionComputerBoatTwo);
  };

  // Sets attack position & turns square red
  const attackComputer = (attackComputerBoat) => {
    console.log("attack computer?", attackComputerBoat);
    if (squaresHumanAttacked.includes(attackComputerBoat)) {
      setAttackPosition(null);
    } else {
      setAttackPosition(attackComputerBoat);
    }
  };

  const finalizeAttack = (finalAttack) => {
    const humanTurn = () => {
      // Add to squares Human attacked
      setSquaresHumanAttacked([...squaresHumanAttacked, finalAttack]);
      console.log("squares human attacked:", squaresHumanAttacked);
      // Check if Human hit/win function
      if (finalAttack === enemyBoat) {
        console.log("HUMAN HIT!!");
        setEnemyBoatRevealed(enemyBoat);
        let newArray = [...enemyBoatsHit];
        newArray[0] = true;
        setEnemyBoatsHit(newArray);
      } else {
        console.log("HUMAN MISS");
      }

      if (finalAttack === enemyBoatTwo) {
        console.log("HUMAN HIT!!");
        setEnemyBoatRevealedTwo(enemyBoatTwo);
        let newArray = [...enemyBoatsHit];
        newArray[1] = true;
        setEnemyBoatsHit(newArray);
      } else {
        console.log("HUMAN MISS");
      }
    };

    const computerTurn = () => {
      // AI guess function
      const computerAttack = Math.floor(Math.random() * 100) + 1;
      // Cannot guess the same square
      if (squaresComputerAttacked.includes(computerAttack)) {
        computerTurn();
      } else {
        // Add to squares Computer attacked
        setSquaresComputerAttacked([
          ...squaresComputerAttacked,
          computerAttack,
        ]);
        console.log("squares computer attacked:", squaresComputerAttacked);
        // Check if Computer hit/win function
        if (computerAttack === humanBoat) {
          console.log("COMPUTER WINS!!");
          setComputerWin(true);
        } else {
          console.log("COMPUTER MISS");
        }
      }
    };

    humanTurn();
    computerTurn();
    // Reset Attack Position
    setAttackPosition(null);
  };

  // Conditions for Human to Win
  const checkHumanWin = () => {
    if (enemyBoatsHit[0] === true && enemyBoatsHit[1] === true) {
      console.log("YOU WIN");
      setHumanWin(true);
    }
  };

  const restartGame = () => {
    setHumanBoat(null);
    setEnemyBoat(null);
    setEnemyBoatTwo(null);
    setEnemyBoatsHit([false, false]);
    setAttackPosition(null);
    setSquaresHumanAttacked([null]);
    setSquaresComputerAttacked([null]);
    gameStarted(false);
    setHumanWin(false);
    setComputerWin(false);
    setEnemyBoatRevealed(null);
  };

  // console.log("is game started??", started);
  console.log("computer boat position", enemyBoat);
  console.log("computer boat 2 position", enemyBoatTwo);
  // console.log("human boat position", humanBoat);
  console.log("enemy boat sunk?", enemyBoatsHit);

  return (
    <>
      <BoardOutterContainer>
        {/* Human Board */}
        <BoardTitleContainer>
          {humanWin ? (
            <p>Human Wins!</p>
          ) : computerWin ? (
            <p>Human Loses!</p>
          ) : (
            <p>Your Board</p>
          )}
          <BoardContainer>
            {board.map((boatPosition) => {
              return (
                <Square
                  style={{
                    background:
                      humanBoat === boatPosition
                        ? "green"
                        : squaresComputerAttacked.includes(boatPosition)
                        ? "#FF9387"
                        : computerWin === true
                        ? "#EBDD2F"
                        : "",
                  }}
                  value={boatPosition}
                  // Cannot click on human board if game is started
                  onClick={
                    !started && !humanWin && !computerWin
                      ? () => positionHumanBoat(boatPosition)
                      : null
                  }
                ></Square>
              );
            })}
          </BoardContainer>
        </BoardTitleContainer>

        {/* Computer Board */}
        <BoardTitleContainer>
          {computerWin ? (
            <p>Computer Wins!</p>
          ) : humanWin ? (
            <p>Computer Loses!</p>
          ) : (
            <p>Computer's Board</p>
          )}
          <BoardContainer>
            {board.map((computerBoatPosition) => {
              return (
                <Square
                  style={{
                    background:
                      attackPosition === computerBoatPosition
                        ? "red"
                        : enemyBoatRevealed === computerBoatPosition
                        ? "green"
                        : enemyBoatRevealedTwo === computerBoatPosition
                        ? "green"
                        : squaresHumanAttacked.includes(computerBoatPosition)
                        ? "#FF9387"
                        : humanWin === true
                        ? "#EBDD2F"
                        : "",
                  }}
                  value={computerBoatPosition}
                  // Can click on computer board if game is started
                  onClick={
                    started && !humanWin && !computerWin
                      ? () => attackComputer(computerBoatPosition)
                      : null
                  }
                ></Square>
              );
            })}
          </BoardContainer>
        </BoardTitleContainer>

        {/* Game Buttons */}
        <ButtonsContainer>
          {!started ? (
            <StartGameButton onClick={() => startGame()}>Start</StartGameButton>
          ) : null}

          {started && !humanWin && !computerWin ? (
            <ShootButton onClick={() => finalizeAttack(attackPosition)}>
              Fire!
            </ShootButton>
          ) : null}

          {started ? (
            <RestartGameButton onClick={() => restartGame()}>
              Play Again
            </RestartGameButton>
          ) : null}
        </ButtonsContainer>
      </BoardOutterContainer>
    </>
  );
};

export default Board;
