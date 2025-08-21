import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const Agenda = () => {
	const { isDarkMode } = useTheme();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDay, setSelectedDay] = useState(null);
	const [newNote, setNewNote] = useState({ text: '', urgency: 'low' });

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

	const [notes, setNotes] = useState(() => {
		try { return JSON.parse(localStorage.getItem('agenda_notes') || '{}'); } catch { return {}; }
	});

	const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	const today = () => setCurrentDate(new Date());

	const getKeyForDay = (day) => `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${day}`;

	const getDayNotes = (day) => {
		if (!day) return [];
		const key = getKeyForDay(day);
		return notes[key] || [];
	};

	const addNote = (day) => {
		if (!day || !newNote.text.trim()) return;
		const key = getKeyForDay(day);
		const dayNotes = getDayNotes(day);
		const note = {
			id: Date.now(),
			text: newNote.text.trim(),
			urgency: newNote.urgency,
			createdAt: new Date().toISOString()
		};
		const updatedNotes = { ...notes, [key]: [...dayNotes, note] };
		setNotes(updatedNotes);
		localStorage.setItem('agenda_notes', JSON.stringify(updatedNotes));
		setNewNote({ text: '', urgency: 'low' });
	};

	const removeNote = (day, noteId) => {
		const key = getKeyForDay(day);
		const dayNotes = getDayNotes(day).filter(n => n.id !== noteId);
		const updatedNotes = { ...notes, [key]: dayNotes };
		setNotes(updatedNotes);
		localStorage.setItem('agenda_notes', JSON.stringify(updatedNotes));
	};

	const getUrgencyColor = (urgency) => {
		switch (urgency) {
			case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
			case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
			default: return 'bg-green-500/20 text-green-400 border-green-500/30';
		}
	};

	const getUrgencyLabel = (urgency) => {
		switch (urgency) {
			case 'high': return 'Urgent';
			case 'medium': return 'Moyen';
			default: return 'Faible';
		}
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
										<div className="space-y-1">
											{getDayNotes(day).map((note) => (
												<div key={note.id} className={`text-xs p-1 rounded border ${getUrgencyColor(note.urgency)} flex items-center justify-between`}>
													<span className="truncate">{note.text}</span>
													<button onClick={() => removeNote(day, note.id)} className="ml-1 text-xs opacity-70 hover:opacity-100">
														<Trash2 className="w-3 h-3" />
													</button>
												</div>
											))}
											<button 
												onClick={() => setSelectedDay(day)}
												className="w-full text-xs text-gray-400 hover:text-gray-300 flex items-center justify-center p-1"
											>
												<Plus className="w-3 h-3 mr-1" />
												Ajouter
											</button>
										</div>
									)}
								</div>
							))}
						</React.Fragment>
					))}
				</div>
			</Card>

			{/* Add Note Modal */}
			{selectedDay && (
				<motion.div 
					initial={{ opacity: 0 }} 
					animate={{ opacity: 1 }} 
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={() => setSelectedDay(null)}
				>
					<Card 
						className={`p-6 w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
							Note pour le {selectedDay} {month}
						</h3>
						<div className="space-y-4">
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
									Note
								</label>
								<Input
									value={newNote.text}
									onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
									placeholder="Votre note..."
									className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}
								/>
							</div>
							<div>
								<label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
									Urgence
								</label>
								<Select value={newNote.urgency} onValueChange={(value) => setNewNote({ ...newNote, urgency: value })}>
									<SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Faible (Vert)</SelectItem>
										<SelectItem value="medium">Moyen (Jaune)</SelectItem>
										<SelectItem value="high">Urgent (Rouge)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex gap-2">
								<Button onClick={() => addNote(selectedDay)} className="flex-1">Ajouter</Button>
								<Button variant="outline" onClick={() => setSelectedDay(null)}>Annuler</Button>
							</div>
						</div>
					</Card>
				</motion.div>
			)}
		</div>
	);
};

export default Agenda;



