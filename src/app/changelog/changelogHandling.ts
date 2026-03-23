'use server'
// import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firedb } from '@/lib/firebase';

export interface Changelog {
    id?: string;
    title: string;
    content: string;
    version: string;
    createdAt?: Timestamp;
}

export async function createChangelog(changelog: Changelog){
    try {
        const ref = collection(firedb, 'changelog')
        await addDoc(ref, {
            ...changelog,
            createdAt: serverTimestamp()
        })
        return {success: true, message: 'Changelog created successfully'}
    } catch (e){
        return {success: false, message: 'Failed to create changelog ' + e}
    }

}

export async function getChangelog(){
    try {
        const ref = collection(firedb, 'changelog')
        const snapshot = await getDocs(ref)
        const changelog = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Changelog[]
        return {success: true, changelog}
    } catch (e){
        return {success: false, message: 'Failed to get changelog ' + e, changelog: [] as Changelog[]}
    }
}