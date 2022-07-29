import { ReactNode, ButtonHTMLAttributes } from 'react';
import { CircleNotch } from 'phosphor-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	tailwindCss: string,
	loading?: boolean,
	children: ReactNode,
}

export function Button({tailwindCss, loading, children, ...rest}: ButtonProps){
	return (
		<button className={`${tailwindCss} text-black-700 font-bold w-full py-2 rounded-sm`} {... rest} disabled={loading}>
				{loading ? <CircleNotch size={22} className="mx-auto animate-spin" /> : <a>{children}</a>}
		</button>
	)
}