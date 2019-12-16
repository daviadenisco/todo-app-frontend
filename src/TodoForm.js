import React from 'react';
import './App.css';
  
function TodoForm({captureFormInput, values}) {
  
  return (
    <div id='form-container'>
      <div className='title-div'>
        <span className='title'>Title: </span>
        <input type='text' className='input' placeholder='Add todo title' value={values.title} name='title' onChange={captureFormInput} />
      </div>
      <div className='title-div'>
        <span className='title'> Due: </span>
        <input type='date' className='input' value={values.date} name='date' onChange={captureFormInput} />
      </div>
      <div>
        <span className='title'>Description: </span>
        <input type='text' className='input' placeholder='Add todo description' value={values.description} name='description' onChange={captureFormInput} />
        
        <div id='add-button' className='add-button-wrapper'>
          <button id='add-button-appearance'>
            ADD NEW ITEM
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoForm;