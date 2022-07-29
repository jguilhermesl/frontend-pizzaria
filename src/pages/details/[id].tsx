import Head from "next/head";
import { useRouter } from "next/router";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Toast } from "../../utils/toast";

interface ProductProps {
	id: string,
	name: string,
	price: string,
	description: string,
	banner: string,
	created_at: string,
	updated_at: string,
	category_id: string
}

interface OrderProps {
	id: string,
	table: number,
	status: boolean,
	draft: boolean,
	name?: string,
	created_at: string,
	updated_at: string,
}

interface DetailsOrderProps {
	id: string,
	amount: number,
	created_at: string,
	updated_at: string,
	order_id: string,
	product_id: string,
	product: ProductProps,
	order: OrderProps,
}

interface DataProps {
	data: DetailsOrderProps[],
	id: string
}

interface ItemFilteredProps {
	id: string,
	name_product: string
	description_product: string,
	price_product: string,
	id_product: string,
	banner_product: string,
	amount_product: number
}

interface OrderFilteredProps {
	table: number,
	status: boolean,
	draft: boolean,
	id: string,
	items: ItemFilteredProps[]
}

export default function OrderDetails({ data, id }: DataProps) {
	const [items, setItems] = useState<ItemFilteredProps[]>([]);
	const [order, setOrder] = useState<OrderFilteredProps>(null);
	const router = useRouter();

	useEffect(() => {
		if (data.length > 0) {
			let array = [];

			if (data && id) {
				data.forEach(item => {
					let itemData = {
						id: item.id,
						name_product: item.product.name,
						description_product: item.product.description,
						price_product: item.product.price,
						id_product: item.product.id,
						banner_product: item.product.banner,
						amount_product: item.amount
					}
					array.push(itemData)
				})
				setItems(array)

				const orderData = {
					table: data[0].order.table,
					status: data[0].order.status,
					draft: data[0].order.draft,
					id: data[0].order.id,
					items: items,
				}
				setOrder(orderData)
			}
		}
	}, [id])

	async function handleFinishOrder() {

		items.forEach(async (item) => {
			await api.delete("/items", { params: { item_id: item.id } })
				.catch((error) => {
					console.log(error)
					return;
				})
		})
		await api.delete("/orders", { params: { order_id: id } })
			.then(() => {
				Toast.fire({
					icon: 'success',
					title: 'Pedido finalizado com sucesso!'
				})
				router.push('/orders')
			})
			.catch((error) => {
				console.log(error)
				Toast.fire({
					icon: 'error',
					title: 'Ops, algo deu errado.'
				})
			})
	}

	function calculateTotalValueOrder() {
		let total = 0;

		items.forEach(item => {
			let value = parseInt(item.price_product) * item.amount_product;
			total += value
		})

		return total;
	}

	return (
		<>
			<Head>
				<title>Pedidos </title>
			</Head>
			<Header />
			<main className="px-[5rem] py-[2rem]">
				{data.length > 0 ? (
					<>
						<header className="w-[80%] mx-auto mb-8 flex justify-between">
							<h1 className="text-xl">Detalhes da Mesa - {order && order.table}</h1>
							<div className="flex gap-2">
								<button
									onClick={handleFinishOrder}
									className="flex bg-green-700 text-black-700 text-sm font-semibold items-center justify-center px-5 rounded-full gap-1 "
								>
									<Check /> Finalizar mesa
								</button>
							</div>
						</header>
						<div className="w-[80%] mx-auto">
							<ul className="flex gap-2 flex-col">
								{items && (
									items.map(item => (
										<li key={item.id_product} className="bg-black-600 w-full px-10 py-2 flex justify-between items-center">
											<img src={`http://localhost:3333/files/${item.banner_product}`} className="object-cover w-[4rem] h-[4rem] rounded-full" />
											<span className="w-[35%]">{item.amount_product} x {item.name_product}</span>
											<span className="w-[20%]">U: R$ {item.price_product},00</span>
											<span className="w-[20%]">T: R$ {parseInt(item.price_product) * item.amount_product},00</span>
										</li>
									))
								)}
							</ul>
							<div className="w-full bg-yellow-700 h-[4.5rem] mt-2 flex items-center justify-between px-[7rem]">
								<span className="text-2xl text-black-700 font-bold">Valor total:</span>
								<span className="text-2xl text-black-700 font-bold">R$ {calculateTotalValueOrder()},00</span>
							</div>
						</div>
					</>
				) : (
					<h1>Pedido não encontrado.</h1>
				)}
			</main>
		</>
	)
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
	const { id } = ctx.params;
	const apiClient = setupAPIClient(ctx);

	const { data } = await apiClient.get('/details', { params: { order_id: id } })

	return {
		props: {
			data,
			id
		}
	}
})