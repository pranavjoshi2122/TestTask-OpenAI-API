import React, { useState } from 'react';
import Modal from './Modal/Modal';
import EditNoteModal from './Modal/EditNoteModal';
import Badge from './Badge';

const Note = ({ note, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
    closeModal();
  };

  return (
    <>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {note.title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 line-clamp-5 min-h-28">{note.body}</p>
        <div className='min-h-28'>
        {note.tag?.length > 0  && note.tag?.filter(tag => tag !== "").map((noteTag )=> <div key={noteTag} className='ml-2 inline-flex'>
          <Badge text={noteTag.charAt(0).toUpperCase() + noteTag.slice(1)}/>
          </div>)}
          </div>
        <div className="flex justify-end mt-2 gap-2">
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={openEditModal}
          >
            Edit 
          </button>
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
            onClick={openModal} // Open modal on click
          >
            Delete
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this note?"
      />
      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={onEdit}
        note={note}
      />
    </>
  );
};

export default Note;
