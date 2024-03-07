
'use client'
import React, { useState, useEffect } from 'react';
import NoteList from '../components/NoteList';
import NoteForm from '@/forms/Noteform';
import Header from '@/components/Header';

const Home = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(storedNotes);
  }, []);

  const addNote = (note) => {
    const newNote = { ...note, id: Date.now() };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const editNote = (editedNote) => {
    const newNotes = notes.map((note) => (note.id === editedNote.id ? editedNote : note));
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  return (
    <>
      <Header />
      <div className='p-4 bg-white w-[90%] mx-auto'>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Create Notes</h1>
        <NoteForm onSubmit={addNote} />
        <NoteList notes={notes} onEdit={editNote} onDelete={deleteNote} />
      </div>
    </>
  );
};

export default Home;
