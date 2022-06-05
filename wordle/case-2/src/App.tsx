import {useCallback, useEffect, useState, useRef} from "react";

import api from "./api";

function App() {

  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<string>("");
  const [turn, setTurn] = useState<number>(0);
  const [status, setStatus] = useState<"playing" | "finished">("playing");
  const [words, setWords] = useState<string[][]>(
    // Opcion 1
    Array.from({length: 6}, () => new Array(5).fill("")),
    // Opcion 2
    // [['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]
    // Opcion 3
    // Array.from(Array(6), () => new Array(5).fill("")),
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {   
      console.log(event.key);
      if (status === "playing") {
        switch (event.key) {
          case "Enter": {
            if (words[turn].some((letter) => letter === "")) {
              return;
            }

            if (words[turn].join("") === answer) {
              setStatus("finished");
            }

            setTurn(turn + 1);

            return;
          }
          case "Backspace": {
            let firstEmptyIndex = words[turn].findIndex((letter) => letter === "");

            if (firstEmptyIndex === -1) {
              firstEmptyIndex = words[turn].length;
            }

            words[turn][firstEmptyIndex - 1] = "";

            setWords(words.slice());

            return;
          }
          default: {
            if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
              const firstEmptyIndex = words[turn].findIndex((letter) => letter === "");              

              if (firstEmptyIndex === -1) return;

              words[turn][firstEmptyIndex] = event.key.toUpperCase();

              setWords(words.slice());

              return;
            }
          }
        }
      } else if (status === "finished" && event.key === "Enter") {
        setStatus("playing");
        setWords(Array.from({length: 6}, () => new Array(5).fill("")));
        setTurn(0);
      }
    },
    [status, turn, words, answer],
  );

  const getWords = async () => {
    const answer = await api.word.random()
    setAnswer(answer)
    toggleLoading(false)
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    console.log(turn, status, words);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);
  

  useEffect(() => {
    // api.word.random().then((answer) => {
    //   setAnswer(answer);
    //   toggleLoading(false);
    // });
    getWords()
  }, []);


  if (isLoading) return "Cargando...";

  return (
    <main className="board">
      {words.map((word, wordIndex) => (
        <section className="word">
          {word.map((letter, letterIndex) => {
            const isCorrect = letter && wordIndex < turn && letter === answer[letterIndex];
            const isPresent =
              letter &&
              wordIndex < turn &&
              letter !== answer[letterIndex] &&
              answer.includes(letter);

            return (
              <article className={`letter ${isPresent && "present"} ${isCorrect && "correct"}`}>
                {letter}
              </article>
            );
          })}
        </section>
      ))}
    </main>
  );
}

export default App;
