import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { junctions as localJunctions } from '../data/junctions';

export function useJunctions() {
    const [junctions, setJunctions] = useState(localJunctions);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, 'junctions'),
            (snapshot) => {
                if (snapshot.empty) {
                    // Use local data if Firestore is empty
                    setJunctions(localJunctions);
                } else {
                    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    setJunctions(data);
                }
                setLoading(false);
            },
            (error) => {
                console.warn('Firestore error, using local data:', error.message);
                setJunctions(localJunctions);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    return { junctions, loading };
}
