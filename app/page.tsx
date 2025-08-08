'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase-client';
import TextSelector from '@/components/text-selector';

interface Car {
  modelname: string;
  typename: string;
  // aggiungi altre proprietà se presenti
}

export default function BrandSelector() {
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [cars, setCars] = useState<Car[]>([]);

  // Recupera i brand
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase.rpc('get_all_brands');

      if (error) {
        console.error("Errore nel recupero dei brand:", error);
        return;
      }

      console.log("Dati ricevuti da get_all_brands:", data);

      if (data && Array.isArray(data)) {
        const brandNames = [
          "all",
          ...data
            .map((b: { make: string }) => b.make)
            .filter((name) => typeof name === 'string' && name.trim() !== '')
            .filter((v, i, a) => a.indexOf(v) === i)
        ];

        console.log("Brand caricati nello state:", brandNames);
        setBrands(brandNames);
      }
    };

    fetchBrands();
  }, []);

  // Al cambio brand → carica le auto associate
  useEffect(() => {
    const fetchCars = async () => {
      if (!selectedBrand) return;

      const { data, error } =
        selectedBrand === 'all'
          ? await supabase.from('cars').select('*').limit(50)
          : await supabase.rpc('get_cars_by_brand', { brand: selectedBrand });

      if (error) {
        console.error('Errore nel recupero auto:', error);
        return;
      }

      console.log("Auto trovate per", selectedBrand, ":", data);
      setCars(data || []);
    };

    fetchCars();
  }, [selectedBrand]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Seleziona una Marca
      </h2>

      <TextSelector
        id="brand"
        label="Marca"
        value={selectedBrand}
        onChange={handleChange}
        disabledOptionText="Seleziona una marca"
        options={brands}
      />

      {selectedBrand && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Risultati per:{" "}
            <span className="text-primary font-bold">
              {selectedBrand === 'all' ? 'Tutte le marche' : selectedBrand}
            </span>
          </h3>

          {cars.length === 0 ? (
            <p className="text-gray-500">Nessuna auto trovata.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {cars.map((car, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-800">{car.modelname}</p>
                  <p className="text-sm text-gray-600">{car.typename}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
