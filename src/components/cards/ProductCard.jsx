import React from 'react'

const ProductCard = ({item, handleDelete}) => {
  return (
    <div>
      <img src={item.image} alt="" />
      <span>{item.title}</span>
      <span>{item.price}</span>

      <button onClick={()=> handleDelete(item._id)}>Sil</button>
    </div>
  )
}

export default ProductCard