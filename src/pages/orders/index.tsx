import { useEffect, useState } from 'react';
import Head from 'next/head'

import { Header } from '../../components/Header';
import { ModalOrder } from './modal/modalOrder';

import { canSSRAuth } from '../../utils/canSSRAuth';
import { Plus } from 'phosphor-react';
import { api } from '../../services/apiClient';
import Link from 'next/link';

export default function Orders(){
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [orders, setOrders] = useState([])

	useEffect( () => {
		async function loadTables(){
			await api.get("/orders").then( (response) => {
				setOrders(response.data)
			})
		}
		loadTables();
	}, [])

	return(
		<>
		  <Head>
				<title>Pedidos </title>
			</Head>
			<Header />
		  <main className="px-[5rem] py-[2rem]">
				<header className="w-[80%] mx-auto mb-8 flex justify-between">
					<h1 className="text-xl">Pedidos - BarDev</h1>
					<div className="flex gap-2">
						<button
							onClick={handleOpen}
							className="flex bg-yellow-700 text-black-700 text-sm font-semibold items-center justify-center px-5 rounded-full gap-1 "
						>
							<Plus /> Abrir nova mesa
						</button>
					</div>
				</header>
				<div className="w-[80%] mx-auto flex flex-col gap-4">
					{orders.map( order => (
						<Link key={order.id} href={`/details/${order.id}`}>
							<div className="border-l-4 bg-black-600 border-yellow-700 w-[60%] mx-auto h-[2.5rem] flex items-center pl-4">
								<span className="text-lg font-semibold">Mesa {order.table}</span>
							</div>
						</Link>
					))}
				</div>
			</main>

			<ModalOrder stateModal={open} closeModal={handleClose} />
		</>
	)
}

export const getServerSideProps = canSSRAuth(async () => {
	return {
		props: {}
	}
})
