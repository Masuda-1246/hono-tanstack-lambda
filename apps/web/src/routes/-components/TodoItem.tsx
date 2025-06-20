import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useDeleteTodo } from "./hooks/useTodo";
import { useUpdateTodo } from "./hooks/useTodo";

export const TodoItem: React.FC<{
	todo: { id: string; title: string; completed: boolean };
}> = ({ todo }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(todo.title);
	const inputRef = useRef<HTMLInputElement>(null);
	const updateTodo = useUpdateTodo();
	const deleteTodo = useDeleteTodo();

	// 編集モードになった時に自動フォーカス
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleToggleComplete = () => {
		updateTodo.mutate({
			id: todo.id,
			title: todo.title,
			completed: !todo.completed,
		});
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditTitle(todo.title);
	};

	const handleSave = () => {
		if (editTitle.trim() !== todo.title) {
			updateTodo.mutate({
				id: todo.id,
				title: editTitle.trim(),
				completed: todo.completed,
			});
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditTitle(todo.title);
		setIsEditing(false);
	};

	const handleDelete = () => {
		deleteTodo.mutate(todo.id);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleEdit();
		}
	};

	return (
		<div className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center flex-1 min-w-0">
				<button
					type="button"
					onClick={handleToggleComplete}
					className={`mr-3 w-5 h-5 rounded-full border-2 transition-colors ${
						todo.completed
							? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
							: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
					}`}
					aria-label={todo.completed ? "未完了にする" : "完了にする"}
				>
					{todo.completed && (
						<svg
							className="w-3 h-3 text-white dark:text-gray-900 m-auto"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<title>完了チェック</title>
							<path
								fillRule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</button>

				{isEditing ? (
					<input
						ref={inputRef}
						type="text"
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
						onKeyDown={handleKeyPress}
						onBlur={handleSave}
						className="flex-1 px-2 py-1 text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-white"
					/>
				) : (
					<button
						type="button"
						className={`flex-1 text-left text-gray-900 dark:text-white cursor-pointer bg-transparent border-none p-0 ${
							todo.completed
								? "line-through text-gray-500 dark:text-gray-400"
								: ""
						}`}
						onClick={handleEdit}
						onKeyDown={handleTitleKeyDown}
						aria-label="タスクを編集"
					>
						{todo.title}
					</button>
				)}
			</div>

			<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
				{!isEditing && (
					<>
						<button
							type="button"
							onClick={handleEdit}
							className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
							aria-label="編集"
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<title>編集</title>
								<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
							</svg>
						</button>
						<button
							type="button"
							onClick={handleDelete}
							className="p-1 text-gray-400 hover:text-red-500 transition-colors"
							aria-label="削除"
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<title>削除</title>
								<path
									fillRule="evenodd"
									d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 011.902-1.995L6 3h8l.098.005A2 2 0 0116 5v1.007c0 .024 0 .048-.002.071L15.84 18a2 2 0 01-1.993 1.858L13.826 20H6.174a2 2 0 01-1.993-1.858L4.162 6.078A1.007 1.007 0 014 6V5zm2 3a1 1 0 10-2 0v7a1 1 0 102 0V8zm8 7V8a1 1 0 10-2 0v7a1 1 0 102 0zm-4 0V8a1 1 0 10-2 0v7a1 1 0 102 0z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</>
				)}
			</div>
		</div>
	);
};
