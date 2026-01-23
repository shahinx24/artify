// import { useState } from "react";

// export default function UserOrder(){
//     const [userOrders, setUserOrders] = useState([]);
//     const viewOrders = async (email) => {
//     console.log("VIEW ORDERS CLICKED FOR:", email);

//     const res = await fetch(
//         `${ENV.API_BASE_URL}/orders?userEmail=${email}`
//     );

//     const data = await res.json();
//     console.log("ORDERS FETCHED:", data);

//     setUserOrders(data);
// };
// return(
//     <>
//     {setUserOrders.map(o => (
//     <tr key={o.id}>
//         <td>#{o.id}</td>
//         <td>{o.status}</td>
//         <td>{o.total}</td>
//         <td>{o.date}</td>
//     </tr>
//     ))}
// </>
// );
// }
