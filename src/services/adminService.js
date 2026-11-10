import { db, isFirebaseConfigured } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

/**
 * Real-time listener for incoming inquiries from Firestore.
 */
export function subscribeToInquiries(onUpdate, fallbackData = []) {
  if (!isFirebaseConfigured || !db) {
    onUpdate(fallbackData);
    return () => {};
  }

  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        onUpdate(items);
      },
      (error) => {
        console.warn('[Firebase] Inquiries sync warning, using local data:', error);
        onUpdate(fallbackData);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Inquiries query error:', error);
    onUpdate(fallbackData);
    return () => {};
  }
}

/**
 * Update an inquiry's status in Firestore.
 */
export async function updateInquiryStatusInDb(inquiryId, newStatus) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const ref = doc(db, 'inquiries', inquiryId);
    await updateDoc(ref, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Firebase] Failed to update inquiry status:', err);
  }
}

/**
 * Add an internal note to an inquiry in Firestore.
 */
export async function addInquiryNoteInDb(inquiryId, noteObj) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const ref = doc(db, 'inquiries', inquiryId);
    await updateDoc(ref, {
      notes: arrayUnion(noteObj),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Firebase] Failed to add inquiry note:', err);
  }
}

/**
 * Create a manual inquiry in Firestore.
 */
export async function createInquiryInDb(inquiryData) {
  if (!isFirebaseConfigured || !db) return { id: `LOCAL-${Date.now()}` };
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...inquiryData,
      createdAt: inquiryData.createdAt || new Date().toISOString(),
      serverTimestamp: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (err) {
    console.error('[Firebase] Failed to create inquiry:', err);
    throw err;
  }
}

/**
 * Real-time listener for projects showcase in Firestore.
 */
export function subscribeToProjects(onUpdate, fallbackData = []) {
  if (!isFirebaseConfigured || !db) {
    onUpdate(fallbackData);
    return () => {};
  }

  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(fallbackData);
        } else {
          const items = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('[Firebase] Projects sync warning, using local data:', error);
        onUpdate(fallbackData);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Projects query error:', error);
    onUpdate(fallbackData);
    return () => {};
  }
}

/**
 * Create a project in Firestore.
 */
export async function createProjectInDb(projectData) {
  if (!isFirebaseConfigured || !db) return { id: projectData.id || `PRJ-${Date.now()}` };
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (err) {
    console.error('[Firebase] Failed to create project:', err);
    throw err;
  }
}

/**
 * Update a project in Firestore (including changing image, title, scale, etc.).
 */
export async function updateProjectInDb(projectId, updatedData) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const ref = doc(db, 'projects', projectId);
    await updateDoc(ref, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Firebase] Failed to update project:', err);
    throw err;
  }
}

/**
 * Delete a project in Firestore.
 */
export async function deleteProjectInDb(projectId) {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (err) {
    console.error('[Firebase] Failed to delete project:', err);
  }
}

/**
 * Seed initial projects into Firestore if empty.
 */
export async function seedInitialProjectsInDb(projects) {
  if (!isFirebaseConfigured || !db) return;
  try {
    for (const proj of projects) {
      await setDoc(doc(db, 'projects', proj.id), {
        ...proj,
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.error('[Firebase] Failed to seed initial projects:', err);
  }
}

