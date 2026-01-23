import { db } from './firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { junctions } from './data/junctions';
import { parking } from './data/parking';

export async function seedDatabase() {
    for (const j of junctions) {
        await setDoc(doc(db, 'junctions', j.id), j);
    }
    for (const p of parking) {
        await setDoc(doc(db, 'parking', p.id), p);
    }
    console.log('Database seeded successfully!');
    return true;
}
