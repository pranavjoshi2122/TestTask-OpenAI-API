import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";
import Badge from "@/components/Badge";

const NoteForm = ({ onSubmit, buttonText = "Add Note" }) => {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const bodyValue = watch("body");

  const debouncedBodyValue = useDebounce(bodyValue, 300);
  const OPENROUTER_API_KEY =
    "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";

  const onSubmitHandler = (data) => {
    onSubmit({ ...data, tag });
    setLoading(false)
    reset();
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchTags = async () => {
      try {
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
  }, [debouncedBodyValue.value]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="mb-4">
      <div className="">
        <div>
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
        </div>
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        />
        {errors.title && (
          <span className="text-red-500">Title is required</span>
        )}
      </div>
      <div className="mt-2">
        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label>
        </div>
        <textarea
          placeholder="Body"
          {...register("body", { required: true })}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 YY"
        ></textarea>
        {errors.body && (
          <span className="text-red-500">Write your thoughts here...</span>
        )}
      </div>
      <div className="mt-4">
        {loading ? ( 
          <span>Loading...</span>
        ) : (
          bodyValue &&
          tag?.length > 0 &&
          tag?.filter(tag => tag !== "").map((noteTag, index) => (
            <div key={index} className="ml-2 inline-flex">
              <Badge text={noteTag.charAt(0).toUpperCase() + noteTag.slice(1)} />
            </div>
          ))
        )}
      </div>
      <div>
        <button
          type="submit"
          className="p-2 mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
