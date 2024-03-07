import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, content }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
            <p className="text-gray-700 mb-4">{content}</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                onClick={onConfirm}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
