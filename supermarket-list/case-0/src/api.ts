import {Item} from "./types";

let listItems = [
  {
    id: 1,
    text: "Some thing to buy",
    completed: false,
  },
  {
    id: 2,
    text: "Some other thing to buy",
    completed: true,
  },
  {
    id: 3,
    text: "Some last to buy",
    completed: false,
  },
]

export default {
  list: (): Promise<Item[]> =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve(listItems);
      }, 1000),
    ),
  delete: (items: Item[], id: number): Promise<Item[]> =>
    new Promise((resolve) =>
      setTimeout(() => {
        let index = items.findIndex(i => i.id === id)
        items[index].completed = !items[index].completed
        resolve(items);
      }, 0),
    ),
  create: (data: Item): Promise<Item[]> => 
      new Promise((resolve) => 
        setTimeout(() => {
          console.log(data)
          listItems.push(data)
          resolve(listItems)
          console.log(listItems)
        }, 500)
      )
};
