import React from 'react';
import { Patient } from '../types';
import { BEDS } from '../constants';

interface PrintDashboardProps {
  patients: Patient[];
}

const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const PrintBed: React.FC<{ patient?: Patient; bedNumber: string }> = ({ patient, bedNumber }) => {
    const age = patient ? calculateAge(patient.dateOfBirth) : null;
    return (
        <div className="border border-black p-2 break-inside-avoid-page flex flex-col min-h-[12rem]">
            <div className="flex-grow">
                <p className="text-base font-bold border-b border-black pb-1 mb-1">Letto {bedNumber}</p>
                {patient ? (
                    <div className="space-y-1">
                        <p className="text-sm font-extrabold truncate">{patient.lastName} {patient.firstName}</p>
                        <p className="text-xs truncate">
                            {new Date(patient.dateOfBirth).toLocaleDateString('it-IT')} ({age} anni)
                        </p>
                        <p className="text-xs truncate">
                            Ricovero: {new Date(patient.admissionDate).toLocaleDateString('it-IT')}
                        </p>
                        <p className="text-xs font-semibold mt-1" title={patient.mainDiagnosis}>
                           Dx: {patient.mainDiagnosis || 'N/D'}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 pt-8">Libero</p>
                )}
            </div>
            {/* Sezione Note */}
            <div className="mt-2 pt-1 border-t border-dashed border-black">
                <p className="text-xs text-black font-semibold">Note:</p>
                <div style={{ minHeight: '50px' }}></div>
            </div>
        </div>
    );
};

const PrintSection: React.FC<{ title: string; beds: string[]; patientsByBed: Map<string, Patient> }> = ({ title, beds, patientsByBed }) => (
    <div className="mb-6 break-inside-avoid">
        <h2 className="text-xl font-extrabold border-b-2 border-black pb-2 mb-4">{title}</h2>
        <div className="grid grid-cols-4 gap-2">
            {beds.map(bed => (
                <PrintBed key={bed} bedNumber={bed} patient={patientsByBed.get(bed)} />
            ))}
        </div>
    </div>
);

const PrintDashboard = React.forwardRef<HTMLDivElement, PrintDashboardProps>(({ patients }, ref) => {
    const patientsByBed = new Map(patients.map(p => [p.bed, p]));

    return (
        <div ref={ref} className="p-8 font-sans bg-white text-black">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-extrabold">Mappa Letti - Medicina Interna</h1>
                <p className="text-lg">Report del {new Date().toLocaleDateString('it-IT')} ore {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
            </header>
            
            <main>
                <PrintSection title="Uomini" beds={BEDS.men} patientsByBed={patientsByBed} />
                <PrintSection title="Donne" beds={BEDS.women} patientsByBed={patientsByBed} />
                <PrintSection title="Lungodegenza Uomini" beds={BEDS.ldu} patientsByBed={patientsByBed} />
                <PrintSection title="Lungodegenza Donne" beds={BEDS.ldd} patientsByBed={patientsByBed} />
            </main>
        </div>
    );
});

export default PrintDashboard;