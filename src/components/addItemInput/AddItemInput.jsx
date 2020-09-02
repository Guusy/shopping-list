import React, { useState } from 'react'


export default ({ onItemAdd }) => {
    const [item, setItemInput] = useState('')
    const submitHandler = (event) => {
        event.preventDefault()
        onItemAdd(item)
        setItemInput('')
    }
    return <form className="app__footer" onSubmit={submitHandler}>
        <input
            type="text"
            className="app__footer__input"
            placeholder="Que queres comprar?"
            value={item}
            onChange={({ target: { value } }) => setItemInput(value)}
        />
        <button type="submit" className="app__btn app__footer__submit-btn">
            +
        </button>
    </form>
}