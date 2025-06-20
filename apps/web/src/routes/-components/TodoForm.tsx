import type React from "react";
import { useState } from "react";
import { useCreateTodo } from "./hooks/useTodo";

export const TodoForm: React.FC = () => {
	const [title, setTitle] = useState("");
	const createTodo = useCreateTodo();
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			createTodo.mutate({
				title: title.trim(),
				completed: false,
			});
			setTitle("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mb-8">
			<div className="flex gap-2">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="新しいタスクを入力..."
					className="flex-1 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
					disabled={createTodo.isPending}
				/>
				<button
					type="submit"
					disabled={!title.trim() || createTodo.isPending}
					className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
				>
					{createTodo.isPending ? "追加中..." : "追加"}
				</button>
			</div>
		</form>
	);
};
