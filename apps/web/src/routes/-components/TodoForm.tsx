import type React from "react";
import { useForm } from "@tanstack/react-form";
import { useCreateTodo } from "./hooks/useTodo";

export const TodoForm: React.FC = () => {
	const createTodo = useCreateTodo();
	const form = useForm({
		defaultValues: {
			title: "",
		},
		onSubmit: async ({ value }) => {
			const trimmedTitle = value.title.trim();
			if (trimmedTitle) {
				await createTodo.mutateAsync({
					title: trimmedTitle,
					completed: false,
				});
				form.reset();
			}
		},
	});
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="mb-8"
		>
			<div className="flex gap-2">
				<form.Field
					name="title"
					validators={{
						onChange: ({ value }) =>
							!value?.trim() ? "タイトルは必須です" : undefined,
					}}
				>
					{(field) => (
						<>
							<input
								type="text"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="新しいタスクを入力..."
								className="flex-1 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
								disabled={createTodo.isPending}
							/>
							{field.state.meta.errors?.length > 0 && (
								<div className="text-red-500 text-sm mt-1">
									{field.state.meta.errors[0]}
								</div>
							)}
						</>
					)}
				</form.Field>
				<button
					type="submit"
					disabled={!form.state.canSubmit || createTodo.isPending}
					className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
				>
					{createTodo.isPending ? "追加中..." : "追加"}
				</button>
			</div>
		</form>
	);
};
