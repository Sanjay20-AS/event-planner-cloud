import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseClient';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError('');

        // Load the event directly from Firestore.
        const eventRef = doc(db, 'events', id);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
          setEvent(null);
          setError('Event not found.');
        } else {
          setEvent({ id: eventSnap.id, ...eventSnap.data() });
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setError(`Could not load event: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Real-time RSVP listener.
    const q = query(collection(db, 'rsvps'), where('event_id', '==', id));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rsvpData = snapshot.docs.map((item) => item.data());
        setRsvps(rsvpData);
      },
      (err) => {
        console.error('Error loading RSVPs:', err);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const handleRSVP = async (status) => {
    if (!user) {
      alert('Please log in to RSVP.');
      return;
    }

    try {
      setError('');

      // Store one RSVP per user per event.
      const rsvpRef = doc(db, 'rsvps', `${id}_${user.uid}`);
      await setDoc(rsvpRef, {
        event_id: id,
        user_id: user.uid,
        status,
        updated_at: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Error saving RSVP:', err);
      setError(`Could not save RSVP: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  if (!event) {
    return (
      <div className="text-center mt-20 text-red-400">
        <p>{error || 'Event not found'}</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const userRsvp = rsvps.find((r) => r.user_id === user?.uid)?.status || 'None';

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Link to="/" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
        <p className="text-slate-300 text-lg mb-8">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <h3 className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">When</h3>
            <p className="text-white font-medium">{event.date} at {event.time}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <h3 className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Where</h3>
            <p className="text-white font-medium">{event.venue}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your RSVP</h2>
              <p className="text-slate-400">
                Current Status: <span className="text-indigo-400 font-bold">{userRsvp}</span>
              </p>
            </div>

            <div className="flex gap-3">
              {['Going', 'Maybe', 'Not Going'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleRSVP(status)}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    userRsvp === status
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

