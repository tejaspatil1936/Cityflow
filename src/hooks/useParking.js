import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { parking as localParking } from '../data/parking';

export function useParking() {
    const [parking, setParking] = useState(localParking);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, 'parking'),
            (snapshot) => {
                if (snapshot.empty) {
                    setParking(localParking);
                } else {
                    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    setParking(data);
                }
                setLoading(false);
            },
            (error) => {
                console.warn('Firestore error, using local data:', error.message);
                setParking(localParking);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    return { parking, loading };
}
