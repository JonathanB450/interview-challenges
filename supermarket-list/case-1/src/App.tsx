import type {Item} from "./types";

import {useEffect, useState, useRef} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const textValue = useRef()
  const [items, setItems] = useState<Item[]>([]);

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  }

  async function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault()
    const dataItem = {
      id: items.length + 1,
      text: textValue.current.value,
      completed:false
    }
    const newList = await api.add(items, dataItem)
    setItems([...newList])
    textValue.current.value = ''
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api.list().then(setItems);
  }, []);

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input ref={textValue} name="text" type="text" autoFocus/>
        <button type="submit">Add</button>
      </form>
      <ul>
        {items?.map((item) => (
          <li
            key={item.id}
            className={item.completed ? styles.completed : ""}
            onClick={() => handleToggle(item.id)}
          >
            {item.text} <button onClick={() => handleRemove(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
