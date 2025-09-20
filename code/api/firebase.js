const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "src-cl.firebaseapp.com",
    projectId: "src-cl",
    storageBucket: "src-cl.appspot.com",
    messagingSenderId: "166725360763",
    appId: "1:166725360763:web:4940274a016bd7064796de"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, getDocs, collection, query, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

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
            gapi.load('client', () => loadClient2())
            async function loadClient2() {
                gapi.client.setApiKey(API_KEY);
                await gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
                console.log("GAPI client loaded for API");
                fetchCuphead()
            }
        } catch (error) {
            console.error("Error fetching documents: ", error)
        }
    },
    firestoreWriteRR: async () => {
        let sav = []
        categories.forEach((category, categoryIndex) => {
            sav.push(getCupheadLevel(categoryIndex).bestTime)
        })
        const obj = {
            sav: sav,
            player: localStorage.getItem('username'),
            category: commBestILsCategory.tabName,
            time: runRecapTime,
            date: new Date().toISOString().slice(0, 10)
        }
        console.log(obj)
        await addDoc(collection(db, 'runRecap'), obj)
            .then(() => {
                console.log(`Run Recap written`);
            })
            .catch((error) => {
                console.error(`Error writing document ${i}: `, error);
            });
    },
    firestoreReadRR: async () => {
        try {
            const collectionRef = collection(db, 'runRecap');
            const q = query(collectionRef);
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach(docSnap => {
                results.push(docSnap.data());
            });
            database = results
            openDatabase()
        } catch (error) {
            console.error('Error reading runRecap documents:', error)
        }
    },
}