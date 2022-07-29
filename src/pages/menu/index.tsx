import { useEffect, useState, useContext } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Header } from '../../components/Header';
import { CardMenu } from '../../components/CardMenu';


import { CaretDown, Plus } from 'phosphor-react'
import { canSSRAuth } from '../../utils/canSSRAuth';

import { ModalCategory } from './modal/modalCategory';
import { ModalProduct } from './modal/modalProduct'
import { api } from '../../services/apiClient';
import { AuthContext } from '../../contexts/AuthContext';

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

export default function Menu(){
	const [openModalCategory, setOpenModalCategory] = useState(false);
	const [openModalProduct, setOpenModalProduct] = useState(false);
  const handleOpenModalCategory = () => setOpenModalCategory(true);
  const handleOpenModalProduct = () => setOpenModalProduct(true);
	const handleClose = () => {
		setOpenModalCategory(false)
		setOpenModalProduct(false)
	}

	const { loadCategories, categories } = useContext(AuthContext)

	useEffect( () => {
		loadCategories();
	}, [])
	

	return(
		<>
		  <Head>
				<title>Cardápio </title>
			</Head>
			<Header />
		  <main className="px-[5rem] py-[2rem]">
				<header className="w-[80%] mx-auto mb-8 flex justify-between">
					<h1 className="text-xl">Cardápio - BarDev</h1>
					<div className="flex gap-2">
						<button
							onClick={handleOpenModalCategory} 
							className=" flex bg-yellow-700 text-black-700 text-sm font-semibold items-center justify-center px-5 rounded-full gap-1 "
						>
							<Plus /> Adicionar categoria
						</button>
						<button 
							onClick={handleOpenModalProduct}
							className="flex bg-yellow-700 text-black-700 text-sm font-semibold items-center justify-center px-5 rounded-full gap-1 "
						>
							<Plus /> Adicionar produto
						</button>
					</div>
				</header>
				<article className="w-[80%] mx-auto flex flex-col justify-center flex-wrap gap-5">
					{categories.map( (category) => (
						<CardMenu key={category.id} categoryId={category.id} categoryName={category.name} />
					))}
				</article>

				<ModalCategory stateModal={openModalCategory} closeModal={handleClose} />
				<ModalProduct stateModal={openModalProduct} closeModal={handleClose} />
			</main>
		</>
	)
}

export const getServerSideProps = canSSRAuth(async () => {
	return {
		props: {}
	}
})
