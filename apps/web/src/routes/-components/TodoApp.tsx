import type React from "react";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export const TodoApp: React.FC = () => {
	return (
		<div className="max-w-2xl mx-auto px-4 py-8">
			{/* Todo作成フォーム */}
			<TodoForm />

			{/* Todoリスト */}
			<TodoList />
		</div>
	);
};
