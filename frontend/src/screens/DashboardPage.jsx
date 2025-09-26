import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({ title: '', description: '', address: '', phone: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const restaurantResponse = await manifest.from('Restaurant').find({ include: ['owner'], sort: { createdAt: 'desc' } });
        setRestaurants(restaurantResponse.data);

        if (user.role === 'customer') {
          const orderResponse = await manifest.from('Order').find({ 
            filter: { customerId: user.id }, 
            include: ['restaurant'],
            sort: { createdAt: 'desc' }
          });
          setOrders(orderResponse.data);
        }
      } catch (e) {
        console.error('Failed to fetch data:', e);
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, manifest]);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const created = await manifest.from('Restaurant').create(newRestaurant);
      setRestaurants([created, ...restaurants]);
      setNewRestaurant({ title: '', description: '', address: '', phone: '' });
    } catch (err) {
      console.error('Failed to create restaurant:', err);
      alert('Error: Could not create restaurant.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FoodieFind</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, <span className="font-medium">{user.name}</span> ({user.role})</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">Admin Panel</a>
            <button onClick={onLogout} className="text-sm font-medium bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>}
        {loading ? (
          <p className="text-center text-gray-500">Loading dashboard...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Restaurant Creation Form */}
              {user.role !== 'customer' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a New Restaurant</h2>
                  <form onSubmit={handleCreateRestaurant} className="space-y-4">
                     <input type="text" placeholder="Restaurant Name" value={newRestaurant.title} onChange={(e) => setNewRestaurant({...newRestaurant, title: e.target.value})} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                     <textarea placeholder="Description" value={newRestaurant.description} onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                     <input type="text" placeholder="Address" value={newRestaurant.address} onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                     <input type="text" placeholder="Phone Number" value={newRestaurant.phone} onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})} className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                     <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Create Restaurant</button>
                  </form>
                </div>
              )}
              {/* Restaurants List */}
              <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurants</h2>
                 <div className="space-y-4">
                   {restaurants.map(r => (
                     <div key={r.id} className="border border-gray-200 p-4 rounded-lg flex space-x-4 items-center">
                       <img src={r.heroImage?.thumbnail || 'https://via.placeholder.com/100'} alt={r.title} className="w-24 h-24 object-cover rounded-md bg-gray-200" />
                       <div>
                         <h3 className="font-bold text-lg text-gray-900">{r.title}</h3>
                         <p className="text-sm text-gray-600">{r.address}</p>
                         <p className="text-xs text-gray-500 mt-1">Owner: {r.owner?.name || 'N/A'}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              {/* User's Orders */}
              {user.role === 'customer' && (
                 <div className="bg-white p-6 rounded-lg shadow">
                   <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Orders</h2>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.map(o => (
                          <div key={o.id} className="border-b pb-3">
                            <p className="font-semibold">{o.restaurant?.title}</p>
                            <p className="text-sm text-gray-600">Total: <span className="font-medium text-green-600">{o.totalPrice}</span></p>
                            <p className={`text-xs capitalize font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${o.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{o.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
