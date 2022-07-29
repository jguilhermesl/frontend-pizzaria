import { createContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router  from 'next/router';

import { api } from '../services/apiClient'
import { Toast } from '../utils/toast';
import { StringDecoder } from 'string_decoder';

type AuthContextData = {
	user: UserProps;
	isAuthenticated: boolean;
	signIn: (credentials: SignInProps) => Promise<void>;
	signOut: () => void;
	loadCategories: () => void;
	loadProducts: (categoryId: string) => Promise<void>;
	categories: CategoryProps[] | [];
	products: ProductProps[] | [];
}

interface CategoryProps{
	id: string;
	name: string;
}

interface ProductProps {
	id: string;
	name: string;
	price: string;
	description: string;
	banner: string;
	category_id: string;
	// created_at: string;
	// updated_at: string;
}

type UserProps = {
	id: string;
	name: string;
	email: string;
}

type SignInProps = {
	email: string;
	password: string;
}

type AuthProviderProps = {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
	try {
		destroyCookie(undefined, '@nextauth.token')
		Router.push('/login')
	} catch {
		console.log("Erro ao deslogar.")
	}
}

export function AuthProvider({children}: AuthProviderProps){
	const [user, setUser] = useState<UserProps>()
	const [categories, setCategories] = useState<CategoryProps[] | []>([])
	const [products, setProducts] = useState<ProductProps[] | []>([])
	const isAuthenticated = !!user;

	useEffect( () => {
		const { '@nextauth.token': token} = parseCookies()

		if(token){
			api.get('/me').then(response => {
				const { id, name, email} = response.data

				setUser({
					id, 
					name, 
					email
				})
			}).catch( (error) => {
				signOut();
			})
		}
	}, [])

	async function signIn({email, password}: SignInProps){
		try{
			const response = await api.post('/session', {email, password})
			const { id, name, token } = response.data 

			setCookie(undefined, '@nextauth.token', token, {
				maxAge: 60 * 60 * 24 * 30,
				path: "/"
			})

			setUser({
				id, 
				name, 
				email
			})

			api.defaults.headers['Authorization'] = `Bearer ${token}`
			Router.push('/')
			Toast.fire({
				icon: 'success',
				title: `Bem vindo de volta, ${name}!`
			})
		} catch(error){
			Toast.fire({
				icon: 'error',
				title: 'Usuário/senha incorretos.'
			})
			console.log(error)
		}
	}

	async function loadCategories() {
		try {
			await api.get("/categories").then( (response) => {
				setCategories(response.data)
			})
		} catch (error) {
			console.log(error)
		}
	}

	async function loadProducts(categoryId) {
		const response = await api.get("/category/products", {
			params: { category_id: categoryId }
		})
	}

	return(
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, loadCategories, loadProducts, categories, products }}>
			{children}
		</AuthContext.Provider>
	)
}