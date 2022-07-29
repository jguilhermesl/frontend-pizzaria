import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { SignOut } from 'phosphor-react'

import logo from '../../../public/img/logo.png'
import { signOut } from '../../contexts/AuthContext'

export function Header(){
	return(
		<>
			<header className="w-full h-[6rem] shadow border-b border-black-600 flex items-center justify-between px-20">
				<Link href="/"><Image src={logo} width={100} height={90} alt="Logo BarDev" className="cursor-pointer"/></Link>
				<nav>
					<ul className="flex items-center gap-12">
						<li className="hover:text-yellow-700 transition duration-500"><Link href="/orders">Pedidos</Link></li>
						<li className="hover:text-yellow-700 transition duration-500"><Link href="/menu">Cardápio</Link></li>
						<li className="hover:text-yellow-700 transition duration-500 cursor-pointer"><button onClick={signOut}><SignOut className="rotate-180" /></button></li>
					</ul>
				</nav>
			</header>
		</>
	)
}