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

const StatItemSimple: React.FC<{ label: string; value: number | string; }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-xl font-bold text-slate-700 dark:text-slate-300">{value}</p>
    </div>
);


const SeverityStatItem: React.FC<{ label: string; count: number; percentage: string; colorClass: string }> = ({ label, count, percentage, colorClass }) => (
    <div className="text-center">
        <p className={`text-base font-semibold ${colorClass}`}>{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{count} <span className="text-sm font-medium">({percentage})</span></p>
    </div>
);

const MobileStat: React.FC<{label: string; value: string | number; colorClass?: string}> = ({label, value, colorClass = 'text-slate-700 dark:text-slate-300'}) => (
    <div className="text-center">
        <p className={`text-xs font-semibold uppercase ${colorClass}`}>{label}</p>
        <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
    </div>
);


const BedOccupancyStats: React.FC = () => {
    const { activePatients } = usePatients();

    const stats = useMemo(() => {
        const menTotal = BEDS.men.length;
        const womenTotal = BEDS.women.length;
        const lduTotal = BEDS.ldu.length;
        const lddTotal = BEDS.ldd.length;

        const menOccupied = activePatients.filter(p => BEDS.men.includes(p.bed)).length;
        const womenOccupied = activePatients.filter(p => BEDS.women.includes(p.bed)).length;
        const lduOccupied = activePatients.filter(p => BEDS.ldu.includes(p.bed)).length;
        const lddOccupied = activePatients.filter(p => BEDS.ldd.includes(p.bed)).length;

        const totalOccupied = menOccupied + womenOccupied + lduOccupied + lddOccupied;
        const totalBeds = menTotal + womenTotal + lduTotal + lddTotal;

        const ordinarioCount = activePatients.filter(p => p.admissionType === 'ordinario').length;
        const lungodegenzaCount = activePatients.filter(p => p.admissionType === 'lungodegenza').length;

        const severities: Record<Severity, number> = { rosso: 0, giallo: 0, verde: 0 };
        activePatients.forEach(p => {
            if (p.severity) {
                severities[p.severity]++;
            }
        });
        const totalWithSeverity = severities.rosso + severities.giallo + severities.verde;


        return { menTotal, womenTotal, lduTotal, lddTotal, menOccupied, womenOccupied, lduOccupied, lddOccupied, totalOccupied, totalBeds, ordinarioCount, lungodegenzaCount, severities, totalWithSeverity };
    }, [activePatients]);

    const getPercentage = (count: number, total: number) => {
        if (total === 0) return '0%';
        return `${((count / total) * 100).toFixed(0)}%`;
    };

    return (
        <div className="bg-slate-50 border-t border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
            {/* Mobile View: Simplified */}
            <div className="mx-auto px-4 py-2 flex sm:hidden justify-around items-center">
                <MobileStat label="Totale" value={`${stats.totalOccupied} / ${stats.totalBeds}`} colorClass="text-blue-600 dark:text-blue-400" />
                <MobileStat label="Critici" value={stats.severities.rosso} colorClass={SEVERITY_TEXT_COLORS.rosso} />
                <MobileStat label="Moderati" value={stats.severities.giallo} colorClass={SEVERITY_TEXT_COLORS.giallo} />
                <MobileStat label="Stabili" value={stats.severities.verde} colorClass={SEVERITY_TEXT_COLORS.verde} />
            </div>

            {/* Desktop View: Full details */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 hidden sm:flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-8 gap-y-4">
                <StatItem label="Uomini" occupied={stats.menOccupied} total={stats.menTotal} />
                <StatItem label="Donne" occupied={stats.womenOccupied} total={stats.womenTotal} />
                
                <div className="flex items-center gap-x-4 px-4 py-1 rounded-lg">
                    <div className="text-center">
                        <p className={`text-base font-semibold ${stats.lduOccupied === stats.lduTotal ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>LDU</p>
                        <p className={`text-xl font-bold ${stats.lduOccupied === stats.lduTotal ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            {stats.lduOccupied} / {stats.lduTotal}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className={`text-base font-semibold ${stats.lddOccupied === stats.lddTotal ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>LDD</p>
                         <p className={`text-xl font-bold ${stats.lddOccupied === stats.lddTotal ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            {stats.lddOccupied} / {stats.lddTotal}
                        </p>
                    </div>
                </div>

                 <div className="hidden sm:block border-l border-slate-300 dark:border-slate-600 h-10 self-center"></div>
                <StatItemSimple label="Ordinario" value={stats.ordinarioCount} />
                <StatItemSimple label="Lungodegenza" value={stats.lungodegenzaCount} />
                 <div className="hidden sm:block border-l border-slate-300 dark:border-slate-600 h-10 self-center"></div>
                 <div className="text-center">
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Totale Occupati</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalOccupied} / {stats.totalBeds}</p>
                </div>
                <div className="hidden sm:block border-l border-slate-300 dark:border-slate-600 h-10 self-center"></div>
                <SeverityStatItem label="Critici" count={stats.severities.rosso} percentage={getPercentage(stats.severities.rosso, stats.totalWithSeverity)} colorClass={SEVERITY_TEXT_COLORS.rosso} />
                <SeverityStatItem label="Moderati" count={stats.severities.giallo} percentage={getPercentage(stats.severities.giallo, stats.totalWithSeverity)} colorClass={SEVERITY_TEXT_COLORS.giallo} />
                <SeverityStatItem label="Stabili" count={stats.severities.verde} percentage={getPercentage(stats.severities.verde, stats.totalWithSeverity)} colorClass={SEVERITY_TEXT_COLORS.verde} />
            </div>
        </div>
    );
};

export default BedOccupancyStats;