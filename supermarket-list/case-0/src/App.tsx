import type {Item} from "./types";

import {useEffect, useState, useRef} from "react";

import styles from "./App.module.scss";
import api from "./api";

function App() {
  const inputValue = useRef('')
  const [items, setItems] = useState<Item[] | null>([]);

  const deleteItem = async (id: number) => {
    const data = await api.delete(items, id)
    setItems([...data])     
  }

  const getItems = () => {
    api.list().then(i => setItems(i));
  }

  const addItem = () => {
    setItems([...items, {
      id: items?.length + 1,
      text: inputValue.current.value,
      completed: false,
    }]);
    inputValue.current.value = ''
  }

  useEffect(() => {
    getItems()
  }, []);

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form>
        <input ref={inputValue} name="text" type="text"  autoFocus />
        <button type="button" onClick={() => addItem()}>Add</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.completed ? styles.completed : ""}>
            {item.text} <button onClick={() => deleteItem(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
