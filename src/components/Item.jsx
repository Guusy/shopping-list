import React from 'react'
import './Item.less'
const Item = ({ item, onDelete, onAdd }) => (
    <div className="app__content__item">
        <p className="app__content__item__text">{item.name} x {item.quantity}</p>
        <div>
            <button
                type="button"
                className="app__btn app__content__item__btn"
                id={item.id}
                onClick={() => onAdd(item)}
            >
                +
    </button>
            <button
                type="button"
                className="app__btn app__content__item__btn"
                id={item.id}
                onClick={() => onDelete(item)}
            >
                –
    </button>
        </div>

    </div>
)

export default Item