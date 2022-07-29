import { useState, useEffect, FormEvent } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '../../../components/ui/Button';

import { Trash } from 'phosphor-react'
import { api } from '../../../services/apiClient';
import { Toast } from '../../../utils/toast';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: '#231f20',
  borderRadius: '10px',
  boxShadow: 20,
  p: 4,
};

interface ModalOrderProps{
	stateModal: boolean, 
	closeModal: () => void;
}

export function ModalOrder({stateModal, closeModal}: ModalOrderProps){
	const [pageModal, setPageModal] = useState(0);
	const [table, setTable] = useState(null);
	const [product, setProduct] = useState(0);
	const [category, setCategory] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [listItems, setListItems] = useState([]);
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([])

	useEffect( () => {
		async function loadCategories() {
			const response = await api.get("/categories")
			setCategories(response.data)
			loadProducts(response.data[0].id)
		}
		loadCategories();
		async function loadProducts(categoryId: string) {
			const response = await api.get("/category/products", { params: { category_id: categoryId }})
			setProducts(response.data)
		}
	}, [])

	function handleChangeCategory(e) {
		setCategory(e.target.value);
		
		loadProducts(categories[e.target.value].id)
		async function loadProducts(categoryId: string) {
			const response = await api.get("/category/products", { params: { category_id: categoryId }})
			setProducts(response.data)
		}
	}

	function handleChangeProduct(e) {
		setProduct(e.target.value)
		console.log(product)
	}

	function cancelOpenTable(){
		closeModal();
		setPageModal(0);
	}

	function addNewItem(e){
		e.preventDefault();

		let itemToAddTable = {
			quantity: quantity,
			category: categories[category],
			product: products[product],
			table: table
		}

		if(listItems.length === 0) {
			setListItems([itemToAddTable])
			console.log(listItems)
			return;
		}

		setListItems([... listItems, itemToAddTable])
	}

	function deleteItemOnTable(indexItem: number){
		let array = listItems.filter( (item, index) => index != indexItem)
		setListItems(array)
	}

	async function finishTable(){
		await api.post("/orders", { table: parseInt(table) }).then( (response) => {
			const { id: table_id } = response.data

			listItems.forEach( async (item) => {

				let data = {
					amount: parseInt(item.quantity),
					order_id: table_id,
					product_id: item.product.id 
				}

				await api.put("/orders", data)
				await api.post("/items", data ).then( (res) => {
					closeModal();
					setPageModal(0);
					setCategory(0);
					setQuantity(1);
					setProduct(0);
					setListItems([]);
					setTable(null);
					Toast.fire({
						icon: 'success',
						title: 'Mesa aberta com sucesso!'
					})
				})
			})
		}).catch( (error) => {
			console.log(error)
		})
	}

	return(
		<>
			<Modal
					open={stateModal}
					onClose={closeModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						{pageModal === 0 ? (
							<div>
								<h1 className="text-2xl mb-4">Abrir nova mesa</h1>
								<label>Número da mesa</label>
								<input type="number" className="w-full py-2 mt-2 mb-3 px-4" value={table} onChange={(e) => setTable(e.target.value)} placeholder="2" />
								<Button tailwindCss="bg-yellow-700" onClick={() => setPageModal(1)}>Continuar</Button>
							</div>
						) : (
							<div className="flex gap-8">
								<form onSubmit={addNewItem} className="flex flex-col w-[50%]">
									<h1 className="text-2xl mb-4">Adicionar produto</h1>
									<label>Categoria</label>
									<select className="w-full py-2 mt-2 mb-3 px-4" value={category} onChange={handleChangeCategory}>
										{categories.map( (category, index) => (
											<option key={category.id} value={index}>{category.name}</option>
										))}
									</select>
									<label>Produto</label>
									<select className="w-full py-2 mt-2 mb-3 px-4" value={product} onChange={handleChangeProduct}>
										{products.map( (product, index) => (
											<option key={product.id} value={index}>{product.name}</option>
										))}
									</select>
									<label>Quantidade</label>
									<input type="number" className="w-full py-2 mt-2 mb-3 px-4" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Min: 1" />
									<div className="flex gap-3 mt-2">
										<Button tailwindCss="bg-yellow-700">Adicionar</Button>
										<Button tailwindCss="text-gray-100 bg-black-600" type="button" onClick={cancelOpenTable}>Cancelar</Button>
									</div>
								</form>
								<ul className="px-[1rem] py-[1rem] w-[50%] flex flex-col gap-3 relative bg-black-600">
									<h1>Itens da mesa - {table}</h1>
									{listItems.map( (item, index) => (
										<li key={index} className="bg-black-600 py-1 px-2 border border-gray-100 border-solid w-full flex justify-between items-center ">
											<span>{item.quantity} x {item.product.name}</span>
											<button><Trash size={22} color="#ff3f4b" onClick={() => deleteItemOnTable(index)}/></button>
										</li>
									))} 
									<Button tailwindCss="bg-yellow-700" onClick={finishTable}>Finalizar</Button>
								</ul>
							</div>
						)} 
					</Box>
      	</Modal>
		</>
	)
}