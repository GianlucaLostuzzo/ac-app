'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase-client';
import TextSelector from '@/components/text-selector';

type BrandRow   = { make: string };       // get_all_brands
type CarRow     = { car_range: string };  // get_cars_by_brand
type VersionRow = { car_version: string };    // get_versions

export default function BrandModelVersionSelector() {
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');

  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState('');

  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // 1) Carica le marche
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase.rpc('get_all_brands');
      if (error) {
        console.error('Errore nel recupero dei brand:', error);
        return;
      }
      // console.log('Dati ricevuti da get_all_brands:', data);

      if (Array.isArray(data)) {
        const brandNames = [
          'all',
          ...data
            .map((b: BrandRow) => b.make)
            .filter((s) => typeof s === 'string' && s.trim() !== '')
            .filter((v, i, a) => a.indexOf(v) === i),
        ];
        // console.log('Brand caricati nello state:', brandNames);
        setBrands(brandNames);
      }
    };

    fetchBrands();
  }, []);

  // 2) Quando cambia la marca → reset e carica i modelli
  useEffect(() => {
    // reset dipendenti dalla marca
    setSelectedModel('');
    setModels([]);
    setSelectedVersion('');
    setVersions([]);

    if (!selectedBrand) return;

    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        if (selectedBrand === 'all') {
          const res = await supabase.from('cars').select('rangename').limit(50);
          if (res.error) throw res.error;

          const list = (res.data ?? [])
            .map((r: { rangename: string }) => r.rangename)
            .filter((s) => typeof s === 'string' && s.trim() !== '');

          const dedup = Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
          // console.log('Modelli (all):', dedup);
          setModels(dedup);
        } else {
          const res = await supabase.rpc('get_cars_by_brand', {
            input_makename: selectedBrand, // <-- nome argomento corretto
          });
          if (res.error) throw res.error;

          const list = (res.data as CarRow[] | null)?.map((r) => r.car_range) ?? [];
          const dedup = Array.from(new Set(list.filter((s) => s?.trim()))).sort((a, b) =>
            a.localeCompare(b),
          );
          // console.log(`Modelli per ${selectedBrand}:`, dedup);
          setModels(dedup);
        }
      } catch (err) {
        console.error('Errore nel recupero modelli:', err);
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedBrand]);

  // 3) Quando cambia il modello → reset e carica le versioni
  useEffect(() => {
    // reset dipendenti dal modello
    setSelectedVersion('');
    setVersions([]);

    if (!selectedModel || !selectedBrand || selectedBrand === 'all') return;

    const fetchVersions = async () => {
      setLoadingVersions(true);
      try {
        const res = await supabase.rpc('get_versions', {
          input_makename: selectedBrand,   // <-- nomi parametri devono combaciare
          input_rangename: selectedModel,
        });
        if (res.error) throw res.error;

        const list =
          (res.data as VersionRow[] | null)?.map((r) => r.car_version) ?? [];

        const dedup = Array.from(new Set(list.filter((s) => s?.trim()))).sort(
          (a, b) => a.localeCompare(b),
        );
        // console.log(`Versioni per ${selectedModel}:`, dedup);
        setVersions(dedup);
      } catch (err) {
        console.error('Errore nel recupero versioni:', err);
        setVersions([]);
      } finally {
        setLoadingVersions(false);
      }
    };

    fetchVersions();
  }, [selectedBrand, selectedModel]);

  // Handlers
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    // console.log('Modello selezionato:', e.target.value);
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(e.target.value);
    // console.log('Versione selezionata:', e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Seleziona Marca, Modello e Versione
      </h2>

      {/* Marca */}
      <div className="mb-6">
        <TextSelector
          id="brand"
          label="Marca"
          value={selectedBrand}
          onChange={handleBrandChange}
          disabledOptionText="Seleziona una marca"
          options={brands}
        />
      </div>

      {/* Modello */}
      <div className="mb-6">
        <TextSelector
          id="model"
          label="Modello"
          value={selectedModel}
          onChange={handleModelChange}
          disabledOptionText={
            loadingModels ? 'Caricamento modelli…' : 'Seleziona un modello'
          }
          options={models}
          disabled={!selectedBrand || loadingModels || models.length === 0}
        />
      </div>

      {/* Versione */}
      <div className="mb-2">
        <TextSelector
          id="version"
          label="Versione"
          value={selectedVersion}
          onChange={handleVersionChange}
          disabledOptionText={
            loadingVersions ? 'Caricamento versioni…' : 'Seleziona una versione'
          }
          options={versions}
          disabled={
            !selectedBrand ||
            !selectedModel ||
            loadingVersions ||
            versions.length === 0
          }
        />
      </div>
    </div>
  );
}
