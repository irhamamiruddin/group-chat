import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

const API_URL =
	`${import.meta.env.VITE_SERVER_URL}/api/auth` ||
	"http://localhost:5000/api/auth";

export interface User {
	id: string;
	username: string;
	email: string;
}

interface AuthContextType {
	user: any;
	login: (email: string, password: string) => Promise<void>;
	register: (
		username: string,
		email: string,
		password: string
	) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	// useEffect(() => {
	// 	const token = localStorage.getItem("token");
	// 	if (token) {
	// 		try {
	// 			const decoded = jwtDecode<User>(token);
	// 			setUser(decoded);
	// 		} catch {
	// 			localStorage.removeItem("token");
	// 		}
	// 	}
	// }, []);

	useEffect(() => {
		axios
			.get(`${API_URL}/me`, { withCredentials: true })
			.then((res) => setUser(res.data.user))
			.catch(() => setUser(null));
	}, []);

	const register = async (
		username: string,
		email: string,
		password: string
	) => {
		const res = await api.post(`/auth/register`, {
			username,
			email,
			password,
		});
		localStorage.setItem("token", res.data.token);
		setUser(jwtDecode(res.data.token));
	};

	const login = async (email: string, password: string) => {
		const res = await api.post(`/auth/login`, {
			email,
			password,
		});
		localStorage.setItem("token", res.data.token);
		setUser(jwtDecode(res.data.token));
	};

	const logout = async () => {
		const res = await api.post(`/auth/login`);
		console.log(res.data);
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
