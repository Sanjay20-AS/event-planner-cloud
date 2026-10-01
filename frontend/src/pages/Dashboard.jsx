import { useState, useEffect } from 'react';
import { db } from '../firebaseClient';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'events'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(eventsData);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore events listener error:', err);
        setError(`Unable to load events: ${err.message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to create an event.');
      return;
    }

    if (!form.title.trim() || !form.description.trim() || !form.date || !form.time || !form.venue.trim() || !form.capacity) {
      setError('Please fill in all fields.');
      return;
    }

    const capacity = Number(form.capacity);
    if (!Number.isInteger(capacity) || capacity <= 0) {
      setError('Capacity must be a positive whole number.');
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, 'events'), {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        venue: form.venue.trim(),
        capacity,
        organizer_id: user.uid,
        created_at: serverTimestamp()
      });

      setForm({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        capacity: ''
      });

      setShowForm(false);
      setSuccess('Event created successfully.');
    } catch (err) {
      console.error('Create event error:', err);
      setError(`Could not create event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-400 mt-20">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setError('');
            setSuccess('');
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {showForm ? '✕ Close' : '+ Create Event'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/40 text-green-300 p-4 rounded-lg">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreateEvent}
          className="mb-8 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2">Event Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="Enter event title"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter event description"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Date</label>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Time</label>
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                type="time"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Venue</label>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                type="text"
                placeholder="Enter venue"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Capacity</label>
              <input
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                type="number"
                min="1"
                placeholder="100"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {saving ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      )}

      {events.length === 0 ? (
        <div className="text-center text-slate-400 mt-12">
          No events available. Click <span className="text-indigo-400">+ Create Event</span> to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id} className="block group">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition shadow-lg hover:shadow-indigo-500/20">
                <h2 className="text-xl font-bold text-indigo-400 mb-2 group-hover:text-indigo-300">{event.title}</h2>
                <p className="text-slate-400 mb-4 line-clamp-2">{event.description}</p>
                <div className="text-sm text-slate-300 space-y-1">
                  <p>🗓️ {event.date} at {event.time}</p>
                  <p>📍 {event.venue}</p>
                  <p>👥 Capacity: {event.capacity}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
