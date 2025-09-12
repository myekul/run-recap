const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "src-cl.firebaseapp.com",
    projectId: "src-cl",
    storageBucket: "src-cl.appspot.com",
    messagingSenderId: "166725360763",
    appId: "1:166725360763:web:4940274a016bd7064796de"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, getDocs, collection, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
window.firebaseUtils = {
    firestoreRead: async () => {
        const collectionRef = collection(db, 'cuphead_main')
        let query1 = query(collectionRef)
        try {
            let querySnapshot = await getDocs(query1)
            globalCache = []
            querySnapshot.forEach(doc => {
                globalCache.push(doc.data());
            });
            letsGo()
        } catch (error) {
            console.error("Error fetching documents: ", error)
        }
    },
    firestoreWriteRR: async () => {
        const obj = {
            sav: runRecap_savFile,
            username: localStorage.getItem('username'),
            category: commBestILsCategory.name,
            time: runRecapTime,
            date: new Date()
        }
        console.log(obj)
        // await addDoc(collection(db, 'runRecap'), obj)
        //     .then(() => {
        //         console.log(`Run Recap written`);
        //     })
        //     .catch((error) => {
        //         console.error(`Error writing document ${i}: `, error);
        //     });
    },
}