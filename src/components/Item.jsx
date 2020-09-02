import React from 'react'
import './Item.less'
const Item = ({ item, onDelete }) => (
    <div className="app__content__item">
        <p className="app__content__item__text">{item.content}</p>
        <button
            type="button"
            className="app__btn app__content__item__btn"
            id={item.id}
            onClick={onDelete}
        >
            –
    </button>
    </div>
)

export default Item