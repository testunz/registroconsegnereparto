import React from 'react';
import { Patient } from '../types';
import { BEDS } from '../constants';
import BedCard from './BedCard';

interface BedMapProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (bed: string) => void;
}

const BedSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-700">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
            {children}
        </div>
    </div>
);

const BedMap: React.FC<BedMapProps> = ({ patients, onSelectPatient, onAddPatient }) => {
  const patientsByBed = new Map(patients.map(p => [p.bed, p]));

  const renderBeds = (bedNumbers: string[]) => {
    return bedNumbers.map(bed => {
      const patient = patientsByBed.get(bed);
      return (
        <BedCard 
          key={bed} 
          bedNumber={bed} 
          patient={patient} 
          onSelectPatient={onSelectPatient}
          onAddPatient={onAddPatient}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
        <BedSection title="Uomini">{renderBeds(BEDS.men)}</BedSection>
        <BedSection title="Donne">{renderBeds(BEDS.women)}</BedSection>
        <BedSection title="Lungodegenza Uomini">{renderBeds(BEDS.ldu)}</BedSection>
        <BedSection title="Lungodegenza Donne">{renderBeds(BEDS.ldd)}</BedSection>
    </div>
  );
};

export default BedMap;