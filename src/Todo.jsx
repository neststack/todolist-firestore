import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

const style = {
  li: `flex justify-between bg-slate-200 my-2 capitalize`,
  liComplete: `flex justify-between bg-slate-400 my-2 capitalize`,
  row: `flex w-full p-4`,
  text: `ml-2 cursor-pointer break-all whitespace-normal`,
  textComplete: `ml-2 cursor-pointer line-through break-all whitespace-normal select-none`,
  buttonDiv: `flex justify-center items-center select-none`,
  button: `h-[40px] w-[40px] cursor-pointer p-1 flex justify-center items-center select-none`,
};

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row} onClick={() => toggleComplete(todo)}>
        <input
          type="checkbox"
          checked={todo.completed ? 'checked' : ''}
          onChange={() => toggleComplete(todo)}
        />
        <p className={todo.completed ? style.textComplete : style.text}>
          {todo.text}
        </p>
      </div>
      <div className={style.buttonDiv}>
        <button className={style.button} onClick={() => deleteTodo(todo.id)}>{<FaRegTrashAlt />}</button>
      </div>
    </li>
  );
};

export default Todo;
