import React, { useEffect, useState } from 'react';
import {checkDueTodayTomorrow, checkOverdue} from './helpers';
import moment from 'moment';

function Todo({ todo, toggleCheckbox, removeTodo, emptyMessage }) {
  const [isOverdue, setOverdue] = useState(false);
  const [isDueTodayTomorrow, setDueTodayTomorrow] = useState(false);

  // updates on page reload so dates and notifications are current
  useEffect(() => {
    setOverdue(checkOverdue(todo));
    setDueTodayTomorrow(checkDueTodayTomorrow(todo));
    console.log('TODO USE EFFECT TRIGGERED')
  }, [todo]);

  let message = null;
  let nameForClass = '';
  function checkStatus() {
    let status = false;
    if (isOverdue) {
      status = true;
      message = 'Overdue!';
      nameForClass = 'overdue';
    };
    if (isDueTodayTomorrow) {
      status = true;
      message = 'Due soon!';
      nameForClass = 'due-today-tomorrow';
    };
    if (todo.complete) {
      status = true;
      message = 'Complete!';
      nameForClass = 'complete';
    };
    return status;
  };

  return (
    <div className={'todo'}>
      <li className={`outer-box {${checkStatus()} ? ${nameForClass} : ''}`}>
        <div className='inner-box'>
          <div className='check-remove-div'>
            <span className='checkbox checkbox-wrapper'>
              <input 
                type='checkbox' 
                onChange={e => toggleCheckbox(todo.id)} 
                checked={todo.complete ? 'checked' : ''}
                className='input-checkbox'
              />
            </span>
            {checkStatus() ? <span className={`notification ${nameForClass}`}>{message}</span> : ''}
          </div>
          <div className='title-details-div'>
            <div>
              <span className='title'>{todo.title} is due {moment(todo.date).format('MM-DD-YYYY')}</span>
            </div>
            <div className='details-div'>
              <span className='details'>Details: </span>
              <span>{todo.description}</span>
            </div>
          </div>
          <span className='remove-button remove-button-wrapper'>
            <button 
              type='button' 
              className='remove-button-appearance' 
              onClick={e => window.confirm('Are you sure you wish to delete this item?') && removeTodo(todo.id)}
            >
              Remove
            </button>
          </span>
        </div>
      </li>
    </div>
  )
};

export default Todo;