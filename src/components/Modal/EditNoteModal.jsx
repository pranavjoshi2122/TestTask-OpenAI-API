import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Badge from "../Badge";

const EditNoteModal = ({ isOpen, onClose, onSubmit, note }) => {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    id: note.id,
    title: note.title,
    body: note.body,
    tag: note.tag,
  });
  const bodyValue = watch("body");
  const submitHandler = async (data) => {
    try {
      await onSubmit({ ...data, id: note.id, tag: tag }); // Use the updated tag state here
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const debouncedBodyValue = useDebounce(bodyValue, 300);
  const OPENROUTER_API_KEY =
    "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";
  React.useEffect(() => {
    reset({
      title: note.title,
      body: note.body,
      tag: note.tag,
    });
  }, [isOpen, note, reset]);

  React.useEffect(() => {
    setTag(note.tag);
  }, [note.tag]);

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchTags = async () => {
      try {
        // Clear existing tags
        setTag([]);
        setLoading(true); // Set loading state to true
        
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content:
                  'generate tags for this note.give answer with tags specified in " " (double-quote) so i can distinguish them(no numbers or anything like that)' +
                  debouncedBodyValue.value,
              },
            ],
          },
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const tagsString = response.data.choices[0].message.content;
        const tagsArray = tagsString
          .split(" ")
          .map((tag) => tag.replace(/"/g, "")); // Remove quotes from each tag
        setTag(tagsArray);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.log("Error fetching tags:", error);
        }
      } finally {
        setLoading(false); // Set loading state to false when request completes
      }
    };
    fetchTags();
    return () => {
      controller.abort();
    };
  }, [debouncedBodyValue.value, OPENROUTER_API_KEY]); 
  
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 max-w-md">
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Note</h2>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: true })}
              className="border rounded p-2 w-full"
            />
            {errors.title && (
              <span className="text-red-500">Title is required</span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="body"
              className="block text-gray-700 font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="body"
              {...register("body", { required: true })}
              className="border rounded p-2 w-full"
            />
            {errors.body && (
              <span className="text-red-500">Description is required</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {loading? ( 
              <span>Suggestion tags are loading...</span>
            ) : (
              bodyValue &&
              tag.length > 0 &&
              tag.map((tag, index) => (
                <Badge
                  key={index}
                  text={tag.charAt(0).toUpperCase() + tag.slice(1)}
                  {...register("tag", { required: false })}
                />
              ))
            )}
          </div>
          <div className="flex justify-end gap-2 items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
