import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActivityCard from '../components/ActivityCard';
import { getAllActivities } from '../services/activityService';

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories for filter dropdown
  const categories = [
    "Todas", "Wellness", "Strength", "Aquatic", "Team Sports", 
    "Martial Arts", "Dance", "Cardio"
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getAllActivities();
        setActivities(data);
        setFilteredActivities(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('No se pudieron cargar las actividades. Por favor, intente nuevamente más tarde.');
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    // Filter activities based on search term and category
    const filtered = activities.filter(activity => {
      const matchesTerm = searchTerm === '' || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Todas' || 
        activity.category === selectedCategory;
      
      return matchesTerm && matchesCategory;
    });

    setFilteredActivities(filtered);
  }, [searchTerm, selectedCategory, activities]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Descubre nuestras actividades deportivas
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Explora una variedad de clases diseñadas para todos los niveles y objetivos
            </p>
          </div>
        </section>

        {/* Search and filter section */}
        <section className="mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por actividad, instructor, palabra clave..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div>
                <select
                  className="w-full md:w-auto p-2 border rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category === "Todas" ? "" : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Activities listing section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Actividades disponibles</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded text-center">
              <p className="text-gray-600 text-lg">No se encontraron actividades que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map(activity => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;