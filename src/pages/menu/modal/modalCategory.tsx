import { useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '../../../components/ui/Button';

import { api } from '../../../services/apiClient';
import { Toast } from '../../../utils/toast';
import { AuthContext } from '../../../contexts/AuthContext';
import { autocompleteClasses } from '@mui/material';

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

interface ModalCategoryProps{
	stateModal: boolean, 
	closeModal: () => void;
}

export function ModalCategory({stateModal, closeModal}: ModalCategoryProps){
	const [category, setCategory] = useState("");

	const { loadCategories } = useContext(AuthContext)

	async function addNewCategory(e){
		e.preventDefault();

		let data = {
			name: category
		}

		Toast.fire({
			icon: 'success',
			title: 'Categoria registrada com sucesso!'
		})

		await api.post("/categories", data).then( (response) =>  {
			console.log(response)
		})
		.catch( (error) => {
			console.log(error)
		})

		setCategory("");
		closeModal();
		loadCategories();
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
						<form onSubmit={addNewCategory}>
							<h1>Adicionar categoria</h1>
							<input type="text" className="w-full py-2 mt-2 mb-3 px-4" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Nome da categoria" />
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