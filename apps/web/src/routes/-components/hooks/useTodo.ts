import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "../../../integrations/hono";

const queryKey = ["todos"];

export const useTodos = () => {
	return useQuery({
		queryKey,
		queryFn: () => client.api.todo.$get().then((res) => res.json()),
	});
};

export const useCreateTodo = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (todo: { title: string; completed: boolean }) =>
			client.api.todo.$post({
				json: todo,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
};

export const useUpdateTodo = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (todo: { id: string; title: string; completed: boolean }) =>
			client.api.todo[":id"].$put({
				param: { id: todo.id },
				json: todo,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
};

export const useDeleteTodo = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			client.api.todo[":id"].$delete({
				param: { id },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
};
