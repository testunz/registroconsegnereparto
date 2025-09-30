import React, { useMemo } from 'react';
import { usePatients } from '../hooks/usePatients';
import { BEDS } from '../constants';

const StatItem: React.FC<{ label: string; occupied: number; total: number }> = ({ label, occupied, total }) => {
    const percentage = total > 0 ? (occupied / total) * 100 : 0;
    const isFull = occupied === total;
    const color = isFull ? 'text-red-500' : 'text-slate-700 dark:text-slate-300';

    return (
        <div className="text-center">
            <p className={`text-base font-semibold ${color}`}>{label}</p>
            <p className={`text-xl font-bold ${color}`}>{occupied} / {total}</p>
        </div>
    );
};

const BedOccupancyStats: React.FC = () => {
    const { activePatients } = usePatients();

    const stats = useMemo(() => {
        const menTotal = BEDS.men.length;
        const womenTotal = BEDS.women.length;
        const ldTotal = BEDS.ldu.length + BEDS.ldd.length;

        const menOccupied = activePatients.filter(p => BEDS.men.includes(p.bed)).length;
        const womenOccupied = activePatients.filter(p => BEDS.women.includes(p.bed)).length;
        const ldOccupied = activePatients.filter(p => BEDS.ldu.includes(p.bed) || BEDS.ldd.includes(p.bed)).length;
        const totalOccupied = menOccupied + womenOccupied + ldOccupied;
        const totalBeds = menTotal + womenTotal + ldTotal;

        return { menTotal, womenTotal, ldTotal, menOccupied, womenOccupied, ldOccupied, totalOccupied, totalBeds };
    }, [activePatients]);

    return (
        <div className="bg-slate-50 border-t border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-center items-center space-x-6 sm:space-x-12">
                <StatItem label="Uomini" occupied={stats.menOccupied} total={stats.menTotal} />
                <StatItem label="Donne" occupied={stats.womenOccupied} total={stats.womenTotal} />
                <StatItem label="Lungodegenza" occupied={stats.ldOccupied} total={stats.ldTotal} />
                 <div className="border-l border-slate-300 dark:border-slate-600 h-10"></div>
                 <div className="text-center">
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Totale Occupati</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalOccupied} / {stats.totalBeds}</p>
                </div>
            </div>
        </div>
    );
};

export default BedOccupancyStats;