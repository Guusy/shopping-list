import { createContext } from 'react'
import FirebaseApp from 'firebase/app'
import 'firebase/firestore'

import { firebaseConfig } from './config'

class Firebase {
    constructor() {
        if (!FirebaseApp.apps.length) {
            FirebaseApp.initializeApp(firebaseConfig)
            FirebaseApp.firestore()
                .enablePersistence({ synchronizeTabs: true })
                .catch(err => console.log(err))
        }

        // instance variables
        this.db = FirebaseApp.firestore()
        this.houseItemsCollection = this.db.collection('house_items')
        this.supermarketItemsCollection = this.db.collection('supermarket_items')
    }
}

const FirebaseContext = createContext(null)

export { Firebase, FirebaseContext, FirebaseApp }