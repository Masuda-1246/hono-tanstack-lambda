import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<nav className="flex items-center">
						<div className="flex-shrink-0">
							<Link
								to="/"
								className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
							>
								Todo App
							</Link>
						</div>
					</nav>

					<div className="flex items-center space-x-4">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
