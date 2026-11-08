import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { useCars, useDeleteCar } from '../features/cars/api';

export const Route = createFileRoute('/cars')({
  component: CarsLayout,
});

function CarsLayout() {
  const location = useLocation();
  // Перевіряємо, чи ми саме на головній сторінці списку
  const isIndex = location.pathname === '/cars' || location.pathname === '/cars/';

  const { data: cars, isLoading, isError, error } = useCars();
  const deleteCarMutation = useDeleteCar();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCarMutation.mutate(id.toString());
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cars Management</h1>
        <Link
          to="/cars/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add New Car
        </Link>
      </div>

      {/* Якщо це головна сторінка — показуємо таблицю, інакше спрацьовує Outlet для дочерніх роутів (/cars/new тощо) */}
      {isIndex ? (
        <>
          {isLoading && <div className="p-4">Loading cars...</div>}
          {isError && <div className="p-4 text-red-500">Error loading cars: {error.message}</div>}

          {!isLoading && !isError && (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-3 px-4 border-b">ID</th>
                    <th className="py-3 px-4 border-b">Brand</th>
                    <th className="py-3 px-4 border-b">Model</th>
                    <th className="py-3 px-4 border-b">Year</th>
                    <th className="py-3 px-4 border-b">Price</th>
                    <th className="py-3 px-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars?.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{car.id}</td>
                      <td className="py-3 px-4 border-b">{car.brand}</td>
                      <td className="py-3 px-4 border-b">{car.model}</td>
                      <td className="py-3 px-4 border-b">{car.year}</td>
                      <td className="py-3 px-4 border-b">${car.price}</td>
                      <td className="py-3 px-4 border-b text-center space-x-3">
                        <Link
                          to="/cars/$carId"
                          params={{ carId: car.id.toString() }}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deleteCarMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cars?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        No cars found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}