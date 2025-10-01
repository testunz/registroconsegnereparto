import React, { useMemo } from 'react';
import { usePatients } from '../hooks/usePatients';
import { BEDS, SEVERITY_TEXT_COLORS } from '../constants';
import { Severity } from '../types';

const StatItem: React.FC<{ label: string; occupied: number; total: number }> = ({ label, occupied, total }) => {
    const isFull = occupied === total;
    const color = isFull ? 'text-red-500' : 'text-slate-700 dark:text-slate-300';

    return (
        <div className="text-center">
            <p className={`text-base font-semibold ${color}`}>{label}</p>
            <p className={`text-xl font-bold ${color}`}>{occupied} / {total}</p>
        </div>
    );
};

const SeverityStatItem: React.FC<{ label: string; count: number; percentage: string; colorClass: string }> = ({ label, count, percentage, colorClass }) => (
    <div className="text-center">
        <p className={`text-base font-semibold ${colorClass}`}>{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{count} <span className="text-sm font-medium">({percentage})</span></p>
    </div>
);


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

        const severities: Record<Severity, number> = { rosso: 0, giallo: 0, verde: 0 };
        activePatients.forEach(p => {
            if (p.severity) {
                severities[p.severity]++;
            }
        });
        const totalWithSeverity = severities.rosso + severities.giallo + severities.verde;


        return { menTotal, womenTotal, ldTotal, menOccupied, womenOccupied, ldOccupied, totalOccupied, totalBeds, severities, totalWithSeverity };
    }, [activePatients]);

    const getPercentage = (count: number, total: number) => {
        if (total === 0) return '0%';
        return `${((count / total) * 100).toFixed(0)}%`;
    };

    return (
        <div className="bg-slate-50 border-t border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 sm:gap-x-12">
                <StatItem label="Uomini" occupied={stats.menOccupied} total={stats.menTotal} />
                <StatItem label="Donne" occupied={stats.womenOccupied} total={stats.womenTotal} />
                <StatItem label="Lungodegenza" occupied={stats.ldOccupied} total={stats.ldTotal} />
                 <div className="border-l border-slate-300 dark:border-slate-600 h-10 self-center"></div>
                 <div className="text-center">
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Totale Occupati</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalOccupied} / {stats.totalBeds}</p>
                </div>
                <div className="border-l border-slate-300 dark:border-slate-600 h-10 self-center"></div>
                <SeverityStatItem label="Critici" count={stats.severities.rosso} percentage={getPercentage(stats.severities.rosso, stats.totalWithSeverity)} colorClass={SEVERITY_TEXT_COLORS.rosso} />
                <SeverityStatItem label="Moderati" count={stats.severities.giallo} percentage={getPercentage(stats.severities.giallo, stats.totalWithSeverity)} colorClass={SEVERITY_TEXT_COLORS.giallo} />
                <SeverityStatItem label="Stabili" count={stats.severities.verde} percentage={getPercentage(stats.severities.verde, stats.totalWithSeverity)} colorClass={SEVERITY_TEXT_COLORS.verde} />
            </div>
        </div>
    );
};

export default BedOccupancyStats;