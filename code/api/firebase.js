const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "src-cl.firebaseapp.com",
    projectId: "src-cl",
    storageBucket: "src-cl.appspot.com",
    messagingSenderId: "166725360763",
    appId: "1:166725360763:web:4940274a016bd7064796de"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, getDocs, collection, query, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

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
                console.log("GAPI loaded");
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
            category: runRecapCategory.tabName,
            time: runRecapTime,
            date: new Date().toISOString().slice(0, 10)
        }
        const uploadCheck = document.getElementById('uploadCheck')
        uploadCheck.innerHTML = `<div class='loader'></div>`
        hide('uploadButton')
        show('uploadCheck')
        await addDoc(collection(db, 'runRecap'), obj)
            .then(() => {
                console.log(`Run Recap written`);
                uploadCheck.innerHTML = fontAwesome('check')
            })
            .catch((error) => {
                console.error(`Error writing document ${i}: `, error);
            });
    },
    firestoreReadRR: async (comparison) => {
        try {
            const collectionRef = collection(db, 'runRecap');
            const q = query(collectionRef);
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach(docSnap => {
                results.push({ id: docSnap.id, ...docSnap.data() });
            });
            database = results.sort((a, b) => new Date(b.date) - new Date(a.date))
            database = database.sort((a, b) => a.player.localeCompare(b.player, undefined, { sensitivity: "base" }))
            database = database.sort((a, b) => a.time.localeCompare(b.time, undefined, { sensitivity: "base" }))
            database = database.sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: "base" }))
            openDatabase(comparison)
        } catch (error) {
            console.error('Error reading runRecap documents:', error)
        }
    },
    firestoreWrite_rrc: async () => {
        const [year, month, day] = runRecap_rrcFile.attempts[rrcAttemptIndex].startedAt.slice(0, 10).split("/").map(Number);
        const obj = {
            scenes: runRecap_rrcFile.attempts[rrcAttemptIndex].scenes,
            player: localStorage.getItem('username'),
            category: runRecapCategory.tabName,
            runDate: new Date(year, month - 1, day),
            uploadDate: new Date().toISOString().slice(0, 10)
        }
        const uploadCheck = document.getElementById('uploadCheck')
        uploadCheck.innerHTML = `<div class='loader'></div>`
        hide('uploadButton')
        show('uploadCheck')
        console.log(obj)
        // await addDoc(collection(db, 'runRecap_rrc'), obj)
        //     .then(() => {
        //         console.log(`.rrc written!`);
        //         uploadCheck.innerHTML = fontAwesome('check')
        //     })
        //     .catch((error) => {
        //         console.error(`Error writing document ${i}: `, error);
        //     });
    },
    // firestoreRead_rrc: async (comparison) => {
    //     try {
    //         const collectionRef = collection(db, 'runRecap_rrc');
    //         const q = query(collectionRef);
    //         const querySnapshot = await getDocs(q);
    //         const results = [];
    //         querySnapshot.forEach(docSnap => {
    //             results.push({ id: docSnap.id, ...docSnap.data() });
    //         });
    //         database = results.sort((a, b) => new Date(b.runDate) - new Date(a.runDate))
    //         database = database.sort((a, b) => a.player.localeCompare(b.player, undefined, { sensitivity: "base" }))
    //         database = database.sort((a, b) => a.scenes.at(-1).endTime.localeCompare(b.scenes.at(-1).endTime, undefined, { sensitivity: "base" }))
    //         database = database.sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: "base" }))
    //         openDatabase(comparison)
    //     } catch (error) {
    //         console.error('Error reading .rrc database:', error)
    //     }
    // },
    firestoreWriteCommBestILs: async () => {
        const obj = {
            player: localStorage.getItem('username'),
            category: runRecapCategory.tabName,
            boss: document.getElementById('dropdown_commBestILs_level').value,
            time: document.getElementById('input_commBestILs_time').value,
            altstrat: document.getElementById('dropdown_commBestILs_altStrat').value,
            other: document.getElementById('input_commBestILs_other').value,
            url: document.getElementById('input_commBestILs_url').value,
            date: new Date().toISOString().slice(0, 10)
        }
        const uploadCheck = document.getElementById('commBestILs_uploadCheck')
        uploadCheck.innerHTML = `<div class='loader'></div>`
        hide('commBestILs_uploadButton')
        show('commBestILs_uploadCheck')
        await addDoc(collection(db, 'commBestILs'), obj)
            .then(() => {
                console.log(`Comm Best IL submitted`);
                uploadCheck.innerHTML = fontAwesome('check')
                if (!altStratLevel) window.firebaseUtils.firestoreReadCommBestILs()
            })
            .catch((error) => {
                console.error(`Error writing document ${i}: `, error);
            });
    },
    firestoreReadCommBestILs: async () => {
        try {
            const collectionRef = collection(db, 'commBestILs');
            const q = query(collectionRef);
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach(docSnap => {
                results.push({ id: docSnap.id, ...docSnap.data() });
            });
            document.getElementById('commBest_queue').innerHTML = pendingSubmissions(results, true)
        } catch (error) {
            console.error('Error reading runRecap documents:', error)
        }
    },
}