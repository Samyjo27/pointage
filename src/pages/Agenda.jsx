import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const Agenda = () => {
	const { isDarkMode } = useTheme();
	const [currentDate, setCurrentDate] = useState(new Date());

	const { year, month, weeks } = useMemo(() => {
		const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
		const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
		const startIndex = (firstDay.getDay() + 6) % 7; // Monday-first
		const daysInMonth = lastDay.getDate();
		const cells = [];
		for (let i = 0; i < startIndex; i++) cells.push(null);
		for (let d = 1; d <= daysInMonth; d++) cells.push(d);
		while (cells.length % 7 !== 0) cells.push(null);
		const weeks = [];
		for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
		return {
			year: currentDate.getFullYear(),
			month: currentDate.toLocaleString('fr-FR', { month: 'long' }),
			weeks,
		};
	}, [currentDate]);

	const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	const today = () => setCurrentDate(new Date());

	const [notes, setNotes] = useState(() => {
		try { return JSON.parse(localStorage.getItem('agenda_notes') || '{}'); } catch { return {}; }
	});

	const getKeyForDay = (day) => `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${day}`;

	const saveNote = (day, text) => {
		if (!day) return;
		const key = getKeyForDay(day);
		const next = { ...notes, [key]: text };
		setNotes(next);
		localStorage.setItem('agenda_notes', JSON.stringify(next));
	};

	return (
		<div className="space-y-6">
			<Helmet>
				<title>Agenda - TimeTrackPro</title>
				<meta name="description" content="Planifiez et consultez vos événements." />
			</Helmet>

			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
				<div>
					<h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Agenda</h1>
					<p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Vue mensuelle</p>
				</div>
				<Calendar className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} h-8 w-8`} />
			</motion.div>

			<Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'} p-6`}>
				<div className="flex items-center justify-between mb-4">
					<div className="text-xl font-semibold capitalize">
						{month} {year}
					</div>
					<div className="space-x-2">
						<Button variant="outline" onClick={prevMonth}>Préc.</Button>
						<Button variant="outline" onClick={today}>Aujourd'hui</Button>
						<Button variant="outline" onClick={nextMonth}>Suiv.</Button>
					</div>
				</div>
				<div className="grid grid-cols-7 gap-2">
					{daysOfWeek.map((d) => (
						<div key={d} className={`text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{d}</div>
					))}
					{weeks.map((week, wi) => (
						<React.Fragment key={wi}>
							{week.map((day, di) => (
								<div key={`${wi}-${di}`} className={`min-h-[120px] rounded-lg p-2 border ${isDarkMode ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200 bg-white'}`}>
									<div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{day || ''}</div>
									{day && (
										<Input
											value={notes[getKeyForDay(day)] || ''}
											onChange={(e) => saveNote(day, e.target.value)}
											placeholder="Note..."
											className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} h-8 text-xs`}
										/>
									)}
								</div>
							))}
						</React.Fragment>
					))}
				</div>
			</Card>
		</div>
	);
};

export default Agenda;



