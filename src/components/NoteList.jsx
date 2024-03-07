import React, { useEffect, useState } from "react";
import Note from "./Note";

const NoteList = ({ notes, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");

  const tagList = notes.reduce((tags, item) => {
    if (item.tag && Array.isArray(item.tag)) { // Check if item.tag exists and is an array
      item.tag.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);
  

  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Update the sorting criteria state
  };

  const handleTagSelect = (event) => {
    const selectedTag = event.target.value;
    setSelectedTag(selectedTag);
    if (selectedTag !== '') {
      const filteredData = notes.filter(note => note.tag.includes(selectedTag));
      setFilteredNotes(filteredData);
    } else {
      setFilteredNotes(notes); // Reset to original data if no tag is selected
    }
  };
  const sortNotes = (notesToSort) => {
    if (sortBy === "tag") {
      return [...notesToSort].sort((a, b) => a.tag.localeCompare(b.tag));
    } else if (sortBy === "title") {
      return [...notesToSort].sort((a, b) => a.title.localeCompare(b.title));
    }
    return filteredNotes;
  };

  const sortedNotes = sortNotes(filteredNotes);

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-4 justify-between md:flex-nowrap flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className=" max-w-xs md:max-w-full  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 blockw-full p-2.5 "
        />

        <div className="flex items-center justify-center md:gap-2 gap-7 flex-wrap">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  md:p-2.5  py-2.5 px-5"
          >
            <option value="">Sort by...</option>
            <option value="title">Title</option>
          </select>
          <select
            value={selectedTag}
            onChange={handleTagSelect}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 "
          >
            <option value="">Organize by tag</option>
            {tagList.filter(tag => tag !== "").map((tag, index) => (
              <option key={index} value={tag}>
                 {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map((note) => (
          <Note key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
