import type {Item} from "./types";

import {useEffect, useState, useRef} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const inputValue = useRef('')
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(true);

  function handleToggle(id: Item["id"]) {
    const index = items.findIndex(i => i.id === id)
    console.log(index);
    let newItems = [...items]
    newItems[index].completed = !newItems[index].completed
    setItems(newItems)
    
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();
    if(inputValue.current.value != ''){
      setItems([...items, {
          id: +new Date(),
          completed: false,
          text: inputValue.current.value,
      }])
    }
    inputValue.current.value = "";
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api
      .list()
      .then(setItems)
      .finally(() => toggleLoading(false));
  }, []);

  if (isLoading) return "Loading...";

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input ref={inputValue} name="text" type="text" />
        <button>Add</button>
      </form>
      <ul>
        {items?.map((item) => (
          <li
            key={item.id}
            className={item.completed ? styles.completed : ""}
            
          >
            <span onClick={() => handleToggle(item.id)}>{item.text}</span> <button onClick={() => handleRemove(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
