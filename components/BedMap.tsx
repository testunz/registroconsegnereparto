import React from 'react';
import { Patient } from '../types';
import { ROOM_LAYOUT } from '../constants';
import BedCard from './BedCard';

interface BedMapProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (bed: string) => void;
}

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
    <div className="space-y-8">
      {ROOM_LAYOUT.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="flex flex-wrap items-start justify-center -m-3">
          {section.groups.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="p-3">
              <div className="bg-slate-200/40 dark:bg-slate-800/30 p-4 rounded-xl">
                 {group.title && <h3 className="text-lg font-semibold mb-3 text-center text-slate-600 dark:text-slate-400">{group.title}</h3>}
                <div className="flex flex-wrap gap-5">
                  {renderBeds(group.beds)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BedMap;