import React, { useState, useEffect, useRef } from 'react'
import Item from './Item'
import { withFirebase } from '../firebase/withFirebase'
import * as theme from '../theme'
import './App.less'
import AddItemInput from './addItemInput/AddItemInput'

const collectionMap = {
    supermarket: 'supermarketItemsCollection',
    house: 'houseItemsCollection',
}
const App = ({ firebase }) => {

    const itemsContainer = useRef(null)
    const [topic, setTopic] = useState('supermarket')
    const [items, setItems] = useState([])
    const [currentTheme, setCurrentTheme] = useState('lightTheme')
    const [buying, setBuying] = useState(false)
    const [searchInput, setSearchInput] = useState('')

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
        const unsubscribe = getCurrentItems()
        return () => unsubscribe()
    }, [topic])

    const getCurrentCollection = () => firebase[collectionMap[topic]]

    const getCurrentItems = () => {
        const collection = getCurrentCollection()
        return collection
            .orderBy('timestamp', 'desc')
            .onSnapshot(({ docs }) => {
                const ideasFromDB = []
                docs.forEach(doc => {
                    const details = {
                        id: doc.id,
                        ...doc.data()
                    }
                    ideasFromDB.push(details)
                })
                setItems(ideasFromDB)
            })
    }
    const onItemDelete = item => {
        const newQuantity = item.quantity - 1
        if (newQuantity > 0) {
            getCurrentCollection().doc(item.id).update({ quantity: newQuantity })
        } else {
            getCurrentCollection().doc(item.id).delete()
        }
    }

    const onItemAddOneMore = item => {
        getCurrentCollection().doc(item.id).update({ quantity: item.quantity + 1 })
    }


    const onItemAdd = (value) => {

        if (!value.trim().length) return
        itemsContainer.current.scrollTop = 0 // scroll to top of container

        getCurrentCollection().add({
            name: value,
            topic,
            quantity: 1,
            bought: false,
            timestamp: new Date()
        })
    }
    const returnItem = (item) => {
        getCurrentCollection().doc(item.id).update({ bought: false })
    }

    const buyItem = (item) => {
        getCurrentCollection().doc(item.id).update({ bought: true })
        setSearchInput('')
    }

    const searchItem = (event) => {
        event.preventDefault()
    }
    const getBoughtItems = () => {
        return items.filter(item => item.bought)
    }

    const finishBuying = (event) => {
        event.preventDefault()
        const items = getBoughtItems()
        if (items.length === 0) {
            alert('No podes terminar la compra si no marcaste ningun producto como comprado')
        }
        const batch = firebase.db.batch();

        items.forEach(item => {
            const ref = getCurrentCollection().doc(item.id)
            batch.delete(ref);
        })

        batch.commit().then(() => {
            setSearchInput('')
            setBuying(false)
        }).catch((error) => {
            console.log('Super error', error)
        });
    }
    return (
        <div className="app">
            <header style={{ position: 'relative' }} >
                <div className="app__header" >
                    <h2 className="app__header__h1"> {buying ? 'Estas en el supermercado' : 'Lista de compras'}</h2>
                    <button
                        type="button"
                        className="app__btn theme-toggle"
                        onClick={() => setBuying(prevState => !prevState)}
                    >
                        {buying ? <>❌</> : <> 🛒</>}
                    </button>
                    <button
                        type="button"
                        className="app__btn theme-toggle"
                        onClick={toggleTheme}
                    >
                        {currentTheme === 'lightTheme' ? '🌑' : '🌕'}
                    </button>
                </div>
                {!buying &&
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
                }
                {buying && <form onSubmit={searchItem} style={{
                    position: 'absolute',
                    width: '100%',
                    padding: '0px 18px'
                }}>
                    <input
                        type="text"
                        className="app__footer__input"
                        style={{ width: '100%', marginBottom: '0.5em', border: '1px solid black' }}
                        placeholder="Busca un producto"
                        value={searchInput}
                        onChange={({ target: { value } }) => setSearchInput(value)}
                    />

                </form>}
            </header>

            <section ref={itemsContainer} className="app__content">
                {buying ?
                    <div style={{ width: '95%' }}>

                        <div>
                            Productos restantes
                    </div>
                        <div>
                            {items.filter(item => !item.bought)
                                .filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase()))
                                .map(item => <Item buying={buying} key={item.id} item={item} onTap={buyItem} />)}
                        </div>
                        <div>
                            Productos recolectados
                    </div>
                        <div>
                            {getBoughtItems().map(item => <Item buying={buying} key={item.id} item={item} onTap={returnItem} />)}
                        </div>
                    </div>
                    : items.map(item => (
                        <Item buying={buying} key={item.id} item={item} onDelete={onItemDelete} onAdd={onItemAddOneMore} />
                    ))}
                {items.length === 0 && <h3 className="app__content__no-idea">Aun no hay nada en el listado...</h3>}
            </section>
            {buying ?
                <form className="app__footer" onSubmit={finishBuying}>
                    <button type="submit" className="app__btn app__footer__submit-btn" >
                        Terminar compra
        </button>
                </form> : <AddItemInput onItemAdd={onItemAdd} />}

        </div>
    )
}

export default withFirebase(App)