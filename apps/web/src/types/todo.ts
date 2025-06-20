// Todo型の定義
export interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

// API呼び出し用の型
export interface CreateTodoRequest {
	title: string;
	completed?: boolean;
}

export interface UpdateTodoRequest {
	title?: string;
	completed?: boolean;
}

export interface TodoItemProps {
	todo: Todo;
}
