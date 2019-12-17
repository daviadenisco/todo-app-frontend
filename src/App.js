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

const baseUrl = 'http://localhost:3001';

const filteredOptions = [  
  { value: 'dueTodayTomorrow', label: 'Due soon' },
  { value: 'complete', label: 'Complete' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'viewAll', label: 'View all' },
];

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
    console.log('APP USE EFFECT TRIGGERED')
  }, []);

  const getTodos = () => {
    axios.get(`${baseUrl}/todos`)
      .then((response) => {
        const todos = response.data;
        let incompleteTodos = todos.filter(todo => !todo.complete);
        let completeTodos = todos.filter(todo => todo.complete);
        let sortedTodos = incompleteTodos.sort(function(a, b) {
          return new Date(a.date) - new Date(b.date);
        })
        let finalTodos = [...sortedTodos, ...completeTodos];
        setTodos(finalTodos);
      })
      .catch((err) => {
        console.log(err)
      })
  }

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

  const addTodo = () => {
    axios.post(`${baseUrl}/todos`, values)
      .then((response) => {
        setValues(initialFormValues);
        getTodos();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function captureFormInput(e) {
    const value = e.target.value;
    if (e.target.name === 'title') {
      if (value.length > 100) {
        alert('Title is too long. Please enter 100 or fewer characters.');
      }
    } 
    if (e.target.name === 'description') {
      if (value.length > 1000) {
        alert('Decription is too long. Please enter 1000 or fewer characters.');
      }
    } 
    setValues({
      ...values,
      [e.target.name]: value,
      completed: false,
    })
  }

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
      })
  }

  function removeTodo(id) {
    axios.delete(`${baseUrl}/todos/${id}`)
      .then((response) => {
        console.log(response.data);
        getTodos();
      }) 
      .catch((err) => {
        console.log(err)
      })
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (values.title && values.date && values.description) {
      addTodo();
    } else {
      alert('A task must contain a title, description, and a due date. Please add the required information and then submit.');
    }
  }

  const handleFilterSelect = option => {
    setSelectedFilter(option.value)
  }

  const filteredTodo = todos.filter(todo => {
    if (selectedFilter === 'overdue') {
      return checkOverdue(todo);
    }
    if (selectedFilter === 'dueTodayTomorrow') {
      return checkDueTodayTomorrow(todo);
    }
    if (selectedFilter === 'complete') {
      return todo.complete;
    }
    if (selectedFilter === 'incomplete') {
      return !todo.complete;
    }
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
          Filter
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
}

export default App;
