import { useEffect, useState } from "react";
import axios from 'axios';
const Cart=()=>{

    const [cartData,setCartData]=useState([]);
    
    const increase = (index) => {
        setCartData(prv=>(            
            prv.map(((item,i)=>(
                index ===i?{...item,
                    qty: item.qty+1,
                    Total: item.Price*(item.qty+1)
                }
                :
                item
            )))            
        ))        
    };

    const decrease = (index) => {
        setCartData(prv=>(            
            prv.map(((item,i)=>(
                index ===i?{...item,
                    qty: item.qty>1? item.qty-1:item.qty,
                    Total: item.qty>1? item.Price*(item.qty-1): item.Price
                }
                :
                item
            )))            
        ))        
    };

    useEffect(()=>{
        if (cartData.length > 0) {
            axios.put(`http://localhost:3000/update-cart`,{cart: cartData},{withCredentials: true})
            // .then(response=>console.log(response.data))
            .catch(error=>console.error("Error to update: "+error))}
    },[cartData])

    const removeItem=(e,id)=>{
        e.stopPropagation();
        setCartData((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.Product.id !== id);
    
            // Ensure API is called even if cart is empty
            axios.put(`http://localhost:3000/update-cart`, { cart: updatedCart }, { withCredentials: true })
                // .then(response => setCartData(response.data.cart))
                .catch(error => console.error("Error updating cart:", error));
    
            return updatedCart;
        });
    };


    useEffect(()=>{
        axios.get(`http://localhost:3000/get-cart`,{ withCredentials: true })
            .then(response=>{setCartData(response.data.cart)
            })
            .catch(error=> console.error("Error to fetching: ",error));
    },[]);

    return(

        <div className="fixed right-2 top-10 border-2 border-black w-1/3 bg-white shadow-lg rounded-lg p-4 z-50">
        <h2 className="text-lg font-bold mb-4">Your Cart</h2>

        <div className="max-h-64 overflow-y-auto">

        {cartData.map((data,index)=>(       
            <div className="border-b py-4">
                <div className="flex items-start space-x-4">   
                            <div className="flex-1">
                            <h3 className="font-bold">{data.Product.product_name}</h3>
                            <p className="text-sm text-gray-500">{data.Product.description}</p>
                            {data.items && Object.entries(data?.items).map(([optionType, optionDetails]) => (
                            <ul className="text-sm text-gray-600">
                                <li><strong>{optionType}</strong> {optionDetails?.name} <strong>Rs.</strong>{optionDetails?.price}</li>
                              </ul>
                            ))}
                           
                            </div>
                    <div className="text-right">
                        <p className="font-bold">Rs. {data.Total}</p>
                    </div>
                </div>
                <div className="flex justify-between mt-2">
                    <div>
                        <button onClick={()=>decrease(index)} className="cursor-pointer bg-lime-600 text-white px-2 py-1 rounded">-</button>
                        <input type="number" min="1" disabled step="1" value={data.qty} className="w-8 text-center mx-1 border rounded" />
                        <button onClick={()=>increase(index)} className="cursor-pointer bg-lime-600 text-white px-2 py-1 rounded">+</button>
                    </div>
                    <div>
                        <button onClick={(e)=>removeItem(e,data.Product.id)} className="cursor-pointer bg-lime-600 text-white px-2 py-1 rounded">🗑</button>
                    </div>
                </div>
            </div>
        ))}
        
        </div>

        <div className="pt-4">
            <p className="flex justify-between text-sm"><span>Subtotal</span> <span>Rs. 605.00</span></p>
            <p className="flex justify-between text-sm"><span>Delivery Charges</span> <span>Rs. 150.00</span></p>
            <p className="flex justify-between text-sm"><span>Tax (15%)</span> <span>Rs. 90.75</span></p>
            <p className="flex justify-between font-bold text-lg mt-2"><span>Grand Total</span> <span>Rs. 845.75</span></p>
        </div>
        <button className="bg-lime-600 text-white w-full py-2 rounded-lg mt-4">Checkout</button>
    </div>
    );
}

export default Cart;