import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function Input({... rest}: InputProps, width: string){
	return(
		<input className={`${width} py-2 mt-2 mb-3 px-4`} {... rest} />
	)
}

export function TextArea({... rest}: TextAreaProps, width: string){
	return(
		<textarea className={`${width} py-2 mt-2 mb-3 px-4`} {... rest}></textarea>
	)
}