import React, { useState, useEffect, useRef } from 'react'
import Item from './Item'
import { withFirebase } from '../firebase/withFirebase'
import * as theme from '../theme'
import './App.less'
import AddItemInput from './addItemInput/AddItemInput'

const App = props => {
    const { itemsCollection } = props.firebase

    const itemsContainer = useRef(null)
    const [topic, setTopic] = useState('supermarket')
    const [items, setItems] = useState([])
    const [currentTheme, setCurrentTheme] = useState('lightTheme')

    const toggleTheme = () => {
        const newTheme = currentTheme === 'lightTheme' ? 'darkTheme' : 'lightTheme'
        setCurrentTheme(newTheme)
    }

    useEffect(() => {
        const selectedTheme = theme[currentTheme]

        Object.keys(selectedTheme).forEach(variable => {
            document.documentElement.style.setProperty(
                variable,
                selectedTheme[variable]
            )
        })
    }, [currentTheme])

    useEffect(() => {
        const unsubscribe = itemsCollection
            .orderBy('timestamp', 'desc')
            .onSnapshot(({ docs }) => {
                const ideasFromDB = []
                console.log(docs)
                docs.forEach(doc => {
                    console.log('doc', doc.data())
                    const details = {
                        id: doc.id,
                        content: doc.data().item,
                        timestamp: doc.data().timestamp
                    }

                    ideasFromDB.push(details)
                })
                console.log('asdasd', ideasFromDB)
                setItems(ideasFromDB)
            })

        return () => unsubscribe()
    }, [])

    const onItemDelete = event => {
        const { id } = event.target
        itemsCollection.doc(id).delete()
    }

    const onItemAdd = (value) => {

        if (!value.trim().length) return
        itemsContainer.current.scrollTop = 0 // scroll to top of container

        itemsCollection.add({
            item: value,
            topic,
            timestamp: new Date()
        })
    }

    return (
        <div className="app">
            <header >
                <div className="app__header" >
                    <h1 className="app__header__h1">Shopping list</h1>
                    <button
                        type="button"
                        className="app__btn theme-toggle"
                        onClick={toggleTheme}
                    >
                        {currentTheme === 'lightTheme' ? '🌑' : '🌕'}
                    </button>
                </div>

                <nav className="app__nav">
                    <div
                        className={`app__nav__item ${topic === 'supermarket' ? 'app__nav__item--selected' : ''}`}
                        onClick={() => setTopic('supermarket')}>
                        Supermercado
                    </div>
                    <div
                        className={`app__nav__item ${topic === 'house' ? 'app__nav__item--selected' : ''}`}
                        onClick={() => setTopic('house')}>
                        Cosas de la casa
                    </div>
                </nav>
            </header>

            <section ref={itemsContainer} className="app__content">
                {items.length === 0 && <h3 className="app__content__no-idea">Aun no hay nada en el listado...</h3>}
                {items.map(item => (
                    <Item key={item.id} item={item} onDelete={onItemDelete} />
                ))}
            </section>

            <AddItemInput onItemAdd={onItemAdd} />
        </div>
    )
}

export default withFirebase(App)