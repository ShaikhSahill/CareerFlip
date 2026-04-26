import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

const to24Hour = (hour, minute, period) => {
    let h = parseInt(hour);
    if (period === 'AM' && h === 12) h = 0;
    if (period === 'PM' && h !== 12) h += 12;
    return `${String(h).padStart(2, '0')}:${minute}`;
};

const today = new Date().toISOString().split('T')[0];

const ScheduleModal = ({ isOpen, onClose, onSchedule, loading }) => {
    const [startHour, setStartHour]     = useState('02');
    const [startMin, setStartMin]       = useState('00');
    const [startPeriod, setStartPeriod] = useState('PM');

    const [endHour, setEndHour]         = useState('05');
    const [endMin, setEndMin]           = useState('00');
    const [endPeriod, setEndPeriod]     = useState('PM');

    const [startDate, setStartDate]       = useState('');
    const [targetEndDate, setTargetEndDate] = useState('');
    const [skipWeekends, setSkipWeekends]   = useState(true);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const startTime = to24Hour(startHour, startMin, startPeriod);
        const endTime   = to24Hour(endHour,   endMin,   endPeriod);
        onSchedule({ startTime, endTime, startDate, targetEndDate, skipWeekends });
    };

    const selectClass =
        'border border-gray-200 rounded-lg px-2 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none cursor-pointer hover:border-purple-300 transition-colors';

    const TimeSelector = ({ hour, setHour, min, setMin, period, setPeriod }) => (
        <div className="flex items-center gap-1">
            <select value={hour} onChange={e => setHour(e.target.value)} className={selectClass}>
                {hours.map(h => <option key={h}>{h}</option>)}
            </select>
            <span className="text-gray-400 font-bold">:</span>
            <select value={min} onChange={e => setMin(e.target.value)} className={selectClass}>
                {minutes.map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={period} onChange={e => setPeriod(e.target.value)} className={`${selectClass} font-bold`}>
                <option>AM</option>
                <option>PM</option>
            </select>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Schedule Learning
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 p-1.5 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <p className="text-sm text-gray-500">
                        We will schedule your learning tasks into your Google Calendar based on your chosen time and dates.
                    </p>

                    {/* Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Clock className="w-4 h-4 text-purple-500" /> Start Time
                            </label>
                            <TimeSelector
                                hour={startHour} setHour={setStartHour}
                                min={startMin}   setMin={setStartMin}
                                period={startPeriod} setPeriod={setStartPeriod}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Clock className="w-4 h-4 text-purple-500" /> End Time
                            </label>
                            <TimeSelector
                                hour={endHour} setHour={setEndHour}
                                min={endMin}   setMin={setEndMin}
                                period={endPeriod} setPeriod={setEndPeriod}
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-500" /> Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            min={today}
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none hover:border-purple-300 transition-colors"
                        />
                    </div>

                    {/* Target End Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-500" /> Target Completion Date
                        </label>
                        <input
                            type="date"
                            value={targetEndDate}
                            onChange={e => setTargetEndDate(e.target.value)}
                            min={startDate || today}
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none hover:border-purple-300 transition-colors"
                        />
                    </div>

                    {/* Skip Weekends */}
                    <div className="flex items-center gap-3 py-1">
                        <input
                            type="checkbox"
                            id="skipWeekends"
                            checked={skipWeekends}
                            onChange={e => setSkipWeekends(e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="skipWeekends" className="text-sm text-gray-700 cursor-pointer select-none">
                            Skip Weekends (Saturday &amp; Sunday)
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:opacity-90 transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                'Confirm Schedule'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
