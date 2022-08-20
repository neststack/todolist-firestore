import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import Todo from './Todo';
import { db } from './firebase';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

const style = {
  bg: `h-screen w-screen p-4 max-h-screen bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 m-auto max-w-[400px] rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  ul: `overflow-y-scroll list-none flex flex-col basis-1 max-h-[450px]`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-blue-400 text-slate-100`,
  count: `text-center p-2`,
  maxCountText: `text-center p-2 text-red-900`,
  spinnerContainer: `flex justify-center m-5 text-blue-600`,
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    const inputText = input;
    setInput('');
    if (input === '') {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 2000);
      return;
    }
    if (todos.length > 19) {
      return;
    }
    await addDoc(collection(db, 'todos'), {
      text: inputText,
      completed: false,
    });
  };

  // Read toto from firebase
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            className={style.input}
            value={input}
            maxLength="80"
            onChange={(e) => {
              setIsError(false);
              setInput(e.target.value);
            }}
            type="text"
            placeholder={isError ? 'Text cannot be empty' : 'Add Todo'}
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        {isLoading ? (
          <div className={style.spinnerContainer}>
            <AiOutlineLoading3Quarters className="loadingSpinner" size={60} />
          </div>
        ) : (
          <>
            <ul className={style.ul}>
              {todos.map((todo, index) => (
                <Todo
                  key={index}
                  todo={todo}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                />
              ))}
            </ul>
            {todos.length > 0 && todos.length < 20 && (
              <p className={style.count}>{`You have ${todos.length} todos`}</p>
            )}
            {todos.length > 19 && (
              <p className={style.maxCountText}>{`You can have maximum 20 todos.`}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
