import type React from "react";
import { useState } from "react";
import { TodoItem } from "./TodoItem";
import { useTodos } from "./hooks/useTodo";

type FilterType = "all" | "active" | "completed";

export const TodoList: React.FC = () => {
	const { data: todos = [], isLoading, error } = useTodos();
	const [filter, setFilter] = useState<FilterType>("all");

	const filteredTodos = todos.filter((todo) => {
		if (filter === "active") return !todo.completed;
		if (filter === "completed") return todo.completed;
		return true;
	});

	const completedCount = todos.filter((todo) => todo.completed).length;
	const activeCount = todos.length - completedCount;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500 dark:text-red-400">
					エラーが発生しました: {error.message}
				</p>
			</div>
		);
	}

	return (
		<div>
			{/* フィルターボタン */}
			<div className="flex justify-center mb-6 space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
				<button
					type="button"
					onClick={() => setFilter("all")}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
						filter === "all"
							? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
					}`}
				>
					すべて ({todos.length})
				</button>
				<button
					type="button"
					onClick={() => setFilter("active")}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
						filter === "active"
							? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
					}`}
				>
					未完了 ({activeCount})
				</button>
				<button
					type="button"
					onClick={() => setFilter("completed")}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
						filter === "completed"
							? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
					}`}
				>
					完了 ({completedCount})
				</button>
			</div>

			{/* Todoリスト */}
			{filteredTodos.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-400 dark:text-gray-500 mb-2">
						<svg
							className="w-16 h-16 mx-auto mb-4"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<title>タスクリストアイコン</title>
							<path
								fillRule="evenodd"
								d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<p className="text-gray-500 dark:text-gray-400">
						{filter === "all" && "まだタスクがありません"}
						{filter === "active" && "未完了のタスクはありません"}
						{filter === "completed" && "完了したタスクはありません"}
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{filteredTodos.map((todo) => (
						<TodoItem key={todo.id} todo={todo} />
					))}
				</div>
			)}
		</div>
	);
};
