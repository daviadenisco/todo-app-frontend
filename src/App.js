import React, {useState, useEffect} from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import TodoForm from './TodoForm';
import Todo from './Todo';
import {checkDueTodayTomorrow, checkOverdue} from './helpers';
import moment from 'moment';
import axios from 'axios';
import './App.css';
import { setState } from 'expect/build/jestMatchersObject';

// used to make calls to the backend
const baseUrl = 'http://localhost:3001';

// option for the filter feature
const filteredOptions = [  
  { value: 'dueTodayTomorrow', label: 'Due soon' },
  { value: 'complete', label: 'Complete' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'viewAll', label: 'View all' },
];

// used to reset the input fields in the form
const initialFormValues = {
  title: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  complete: false
};

function App() {
  const [values, setValues] = useState(initialFormValues);
  const [todos, setTodos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('viewAll');

  useEffect(() => {
    getTodos();
  }, []);

  // gets the todos from the database, sorts them in due date order with completed todos at bottom of list
  const getTodos = () => {
    axios.get(`${baseUrl}/todos`)
      .then((response) => {
        const todos = response.data;
        let incompleteTodos = todos.filter(todo => !todo.complete);
        let completeTodos = todos.filter(todo => todo.complete);
        let sortedTodos = incompleteTodos.sort(function(a, b) {
          return new Date(a.date) - new Date(b.date);
        });
        let finalTodos = [...sortedTodos, ...completeTodos];
        setTodos(finalTodos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // async await version of getTodos
  // const getTodos = async () => {
  //   let todos = await axios.get(`${baseUrl}/todos`)
  //   todos = todos.data;
  //   let incompleteTodos = todos.filter(todo => !todo.complete);
  //   let completeTodos = todos.filter(todo => todo.complete);
  //   let sortedTodos = incompleteTodos.sort(function(a, b) {
  //     return new Date(a.date) - new Date(b.date);
  //   })
  //   let finalTodos = [...sortedTodos, ...completeTodos];
  //   setTodos(finalTodos);
  // }

  // adds a todo, resets the form input field values, and updates the todos on the page
  const addTodo = () => {
    axios.post(`${baseUrl}/todos`, values)
      .then((response) => {
        setValues(initialFormValues);
        getTodos();
      })
      .catch((err) => {
        console.log(err)
      });
  };

  // gets the values from the input fields in the form
  // alerts keep app from crashing and tells user if too much text is in title or descriptions
  function captureFormInput(e) {
    const value = e.target.value;
    if (e.target.name === 'title') {
      if (value.length > 100) {
        alert('Title is too long. Please enter 100 or fewer characters.');
      };
    } ;
    if (e.target.name === 'description') {
      if (value.length > 1000) {
        alert('Decription is too long. Please enter 1000 or fewer characters.');
      };
    };
    setValues({
      ...values,
      [e.target.name]: value,
      completed: false,
    });
  };

  // toggle complete for each todo, updates the todos when complete or incomplete
  function toggleCheckbox(id) {
    const updatedTodo = todos.find(todo =>{
      return todo.id === id;
    });
    updatedTodo.complete = !updatedTodo.complete;
    axios.put(`${baseUrl}/todos/${id}`, updatedTodo)
      .then((response) => {
        console.log(response.data);
        getTodos();
      })
      .catch((err) => {
        console.log(err)
      });
  };

  // removes a todo and updates the todos on the page
  function removeTodo(id) {
    axios.delete(`${baseUrl}/todos/${id}`)
      .then((response) => {
        console.log(response.data);
        getTodos();
      }) 
      .catch((err) => {
        console.log(err)
      });
  };

  // submits a new todo if title, date, and description are included or alerts the user that something is missing.
  function handleSubmit(e) {
    e.preventDefault();
    if (values.title && values.date && values.description) {
      addTodo();
    } else {
      alert('A task must contain a title, description, and a due date. Please add the required information and then submit.');
    };
  };

  // sets the filter selection
  const handleFilterSelect = option => {
    setSelectedFilter(option.value);
  };

  // filters todo based on filter selection
  const filteredTodo = todos.filter(todo => {
    if (selectedFilter === 'overdue') {
      return checkOverdue(todo);
    };
    if (selectedFilter === 'dueTodayTomorrow') {
      return checkDueTodayTomorrow(todo);
    };
    if (selectedFilter === 'complete') {
      return todo.complete;
    };
    if (selectedFilter === 'incomplete') {
      return !todo.complete;
    };
    return true;
  });
  
  return (
    <div id='app'>
      <div id='sticky'>
        <h1 id='header'>TODO List</h1>
        <form id='form' onSubmit={handleSubmit}>
          <TodoForm addTodo={addTodo} captureFormInput={captureFormInput} values={values} />
        </form>
        <div className='filter'>
          <Dropdown options={filteredOptions} onChange={handleFilterSelect} value={selectedFilter} placeholder="Select an option" />
        </div>
      </div>
      <div className='list-div'>
      <ul className='todo-list'>
        {filteredTodo && filteredTodo.length ? filteredTodo.map((todo, index) => (
          <Todo key={todo.id} index={index} todo={todo} toggleCheckbox={toggleCheckbox} removeTodo={removeTodo} />
        )) : <div>Nothing here!</div>}
      </ul>
      </div>
    </div>
  );
};

export default App;
