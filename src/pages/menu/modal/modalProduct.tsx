import { FormEvent, useEffect, useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '../../../components/ui/Button';
import { Upload } from 'phosphor-react';

import { api } from '../../../services/apiClient';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../services/api';
import { Toast } from '../../../utils/toast';
import { AuthContext } from '../../../contexts/AuthContext';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: '#231f20',
  borderRadius: '10px',
  boxShadow: 20,
  p: 4,
};

interface ModalProductProps{
	stateModal: boolean, 
	closeModal: () => void
}

interface CategoryProps {
	id: string,
	name: string
}

export function ModalProduct({stateModal, closeModal}: ModalProductProps){
	const [product, setProduct] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState(0);
	const [imageProduct, setImageProduct] = useState(null);
	const [productURL, setProductURL] = useState(null);

	const { loadCategories, categories } = useContext(AuthContext)
	
	useEffect( () => {
		loadCategories()
		console.log(categories)
	}, [])

	async function addNewProduct(e: FormEvent ){
		e.preventDefault();

		try {
			const data = new FormData();

			if(product === '' || price === '' || description === '' || imageProduct === null) {
				Toast.fire({
					icon: 'warning',
					title: 'Preencha todos os campos!'
				})
				return;
			}

			data.append('name', product)
			data.append('price', price)
			data.append('description', description)
			data.append('file', imageProduct)
			data.append('category_id', categories[category].id)

			await api.post('/products', data)
			Toast.fire({
				icon: 'success', 
				title: 'Produto cadastrado com sucesso!'
			})
			
			setProduct("")
			setPrice("")
			setDescription("")
			setCategory(0)
			setImageProduct(null)
			setProductURL(null)
			closeModal()
			loadCategories()
		}catch(err) {
			console.log(err)
		}

		setCategory(0)
	}

	function handleFile(e){
		if(e.target.files[0]){
			const image = e.target.files[0]
			if(image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/jpg') {
				setImageProduct(image)
				setProductURL(URL.createObjectURL(image))
			}
		}
	}

	function handleChangeCategory(e) {
		setCategory(e.target.value)
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
						<form onSubmit={addNewProduct} className="flex flex-col gap-2">
							<h1 className="text-2xl mb-1">Adicionar produto</h1>
							<div className="bg-black-700 h-[12rem] z-0 relative border border-gray-100 rounded hover:bg-black-600">
								<input type="file" accept="image/*" onChange={handleFile} className="z-[99] w-full h-[12rem] cursor-pointer opacity-0 absolute" />
								<Upload size={40} className="z-[98] absolute top-1/2 translate-x-0 translate-y-[-50%] w-full flex cursor-pointer"/>
								{productURL === null ? "" : (
									<img 
										src={productURL} 
										alt="" 
										className="w-full h-full object-cover z-0"
								 />
								 )}
							</div>
							<div className="flex gap-2">
								<div>
									<label>Categoria</label>
									<select className="w-full py-2 px-4" value={category} onChange={handleChangeCategory}>
										{categories.map( (item, index) => (
											<option key={item.id} value={index}>{item.name}</option>
										))}
									</select>
								</div>
								<div>
									<label>Preço</label>
									<input type="text" className="w-full py-2 px-4" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12" />
								</div>
							</div>
							<label>Nome do produto</label>
							<input type="text" className="w-full py-2 px-4" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Batata frita" />
							<label>Descrição</label>
							<textarea className="w-full py-2 px-4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do produto" />
							<div className="flex gap-3 mt-2">
								<Button tailwindCss="bg-yellow-700">Adicionar</Button>
								<Button tailwindCss="text-gray-100 bg-black-600" type="button" onClick={closeModal}>Cancelar</Button>
							</div>
						</form>
					</Box>
      	</Modal>
		</>
	)
}