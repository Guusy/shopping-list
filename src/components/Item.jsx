import React from 'react'
import './Item.less'
const Item = ({ buying, item, onDelete, onAdd, onTap }) => (
    <div className="app__content__item" onClick={buying ? () => onTap(item) : undefined}>
        <p
            className={`app__content__item__text ${item.bought ? 'app__content__item__text--bought' : ''}`}
        >
            {item.name} x {item.quantity}</p>
        <div>
            {!buying && <>
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
            </>}
        </div>

    </div>
)

export default Item