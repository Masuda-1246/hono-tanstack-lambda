import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
	isDark: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isDark, setIsDark] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// クライアントサイドでのみローカルストレージから初期値を取得
		const saved = localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const initialDark = saved === "dark" || (saved === null && prefersDark);

		setIsDark(initialDark);
		setIsInitialized(true);

		// 初期状態でHTMLクラスを設定
		if (initialDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	useEffect(() => {
		if (!isInitialized) return;

		// ローカルストレージに保存
		localStorage.setItem("theme", isDark ? "dark" : "light");

		// HTMLのクラスを更新
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDark, isInitialized]);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
