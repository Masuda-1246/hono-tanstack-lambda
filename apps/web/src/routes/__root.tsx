import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { ThemeProvider } from "../contexts/ThemeContext";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<ThemeProvider>
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
				<Header />

				<main>
					<Outlet />
				</main>

				<TanStackRouterDevtools />
				<TanStackQueryLayout />
			</div>
		</ThemeProvider>
	),
});
