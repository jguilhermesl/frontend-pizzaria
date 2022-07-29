import { useState, SyntheticEvent, useEffect, ChangeEvent, useContext } from 'react';
import { CaretDown, Trash } from 'phosphor-react'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { api } from '../../services/apiClient';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext'

interface CardMenuProps {
	categoryId: string,
	categoryName: string
}

interface ProductProps {
	banner: string,
	category_id: string,
	created_at: string,
	description: string,
	id: string,
	name: string,
	price: string,
	updated_at: string
}

export function CardMenu({ categoryId, categoryName }: CardMenuProps) {
	const [expanded, setExpanded] = useState<string | false>(false);
	const [products, setProducts] = useState([])

	const handleChange =
		(panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	useEffect(() => {
		loadProducts(categoryId)
	}, [])

	async function loadProducts(categoryId) {
		const response = await api.get("/category/products", {
			params: { category_id: categoryId }
		})
		setProducts(response.data)
	}

	async function deleteProduct(product_id: string) {
		const response = await api.delete(`/products/${product_id}`)
		loadProducts(categoryId)
	}

	return (
		<div className="w-full">
			{products.length > 0 && <h1 className="mb-1">{categoryName}</h1>}
			{products.map(product => (
				<Accordion sx={{ width: '100%' }} expanded={expanded === product.id} onChange={handleChange(product.id)} key={product.id}>
					<AccordionSummary
						expandIcon={<CaretDown />}
						aria-controls="panel1bh-content"
						id="panel1bh-header"
					>
						<Typography sx={{ width: '50%', flexShrink: 0 }}>
							{product.name}
						</Typography>
						<Typography sx={{ color: 'text.secondary' }}>R$ {product.price},00</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography className="flex gap-5 items-center relative">
							<img src={`http://localhost:3333/files/${product.banner}`} className="w-[4rem] h-[4rem] object-cover rounded-full" />
							<span className="pr-16">{product.description}</span>
							<Button
								onClick={() => deleteProduct(product.id)}
								tailwindCss="w-[3rem] bg-red-700 text-gray-100 flex items-center justify-center absolute right-2"
							>
								<Trash />
							</Button>
						</Typography>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	)
}