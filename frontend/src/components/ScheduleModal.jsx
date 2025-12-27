import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, onSchedule, loading }) => {
    const [startTime, setStartTime] = useState('14:00'); // Default 2 PM
    const [endTime, setEndTime] = useState('17:00');   // Default 5 PM
    const [targetEndDate, setTargetEndDate] = useState('');
    const [skipWeekends, setSkipWeekends] = useState(true);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSchedule({
            startTime,
            endTime,
            targetEndDate,
            skipWeekends
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Schedule Learning
                    </h2>
                    <button onClick={onClose} className="hover:bg-purple-700 p-1 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 mb-4">
                        We will automatically schedule your learning tasks into your Google Calendar based on your availability.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Start Time
                            </label>
                            <input 
                                type="time" 
                                value={startTime} 
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> End Time
                            </label>
                            <input 
                                type="time" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Target Completion Date</label>
                        <input 
                            type="date" 
                            value={targetEndDate} 
                            onChange={(e) => setTargetEndDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            required 
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input 
                            type="checkbox" 
                            id="skipWeekends" 
                            checked={skipWeekends} 
                            onChange={(e) => setSkipWeekends(e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="skipWeekends" className="text-sm text-gray-700 cursor-pointer select-none">
                            Skip Weekends (Saturday & Sunday)
                        </label>
                    </div>

                    {/* Footer / Actions */}
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-2.5 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Scheduling...
                                </>
                            ) : (
                                "Confirm Schedule"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
