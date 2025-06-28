import React, { useEffect, useState } from 'react';
import {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  getNotes,
  addNote,
  editNote,
  deleteNote,
} from '../../services/api';
import styles from './MealPlanner.module.css';

const daysOfWeek = [
  'Bazar ertəsi',
  'Çərşənbə axşamı',
  'Çərşənbə',
  'Cümə axşamı',
  'Cümə',
  'Şənbə',
  'Bazar'
];
const mealTypes = ['Səhər yeməyi', 'Günorta yeməyi', 'Axşam yeməyi', 'Şirniyyat'];

const MealPlanner = () => {
  const [meals, setMeals] = useState([]);
  const [mealInputs, setMealInputs] = useState({});
  const [editingMeals, setEditingMeals] = useState({});

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState({});

  useEffect(() => {
    fetchMeals();
    fetchNotes();
  }, []);

  const fetchMeals = async () => {
    try {
      const data = await getMeals();
      setMeals(data);
    } catch (err) {
      console.error('Yeməklər alınmadı:', err);
    }
  };

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Qeydlər alınmadı:', err);
    }
  };

  const handleMealChange = (day, type, value) => {
    setMealInputs(prev => ({ ...prev, [`${day}-${type}`]: value }));
  };

  const handleMealAdd = async (day, mealType) => {
    const key = `${day}-${mealType}`;
    const content = mealInputs[key];
    if (!content) return;
    await addMeal({ day, mealType, content });
    setMealInputs(prev => ({ ...prev, [key]: '' }));
    fetchMeals();
  };

  const handleMealEdit = (id, content) => {
    setEditingMeals(prev => ({ ...prev, [id]: content }));
  };

  const handleMealSave = async (id) => {
    await updateMeal(id, { content: editingMeals[id] });
    setEditingMeals(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    fetchMeals();
  };

  const handleMealDelete = async (id) => {
    await deleteMeal(id);
    fetchMeals();
  };

  const groupedMeals = {};
  meals.forEach(meal => {
    if (!groupedMeals[meal.day]) groupedMeals[meal.day] = {};
    if (!groupedMeals[meal.day][meal.mealType]) groupedMeals[meal.day][meal.mealType] = [];
    groupedMeals[meal.day][meal.mealType].push(meal);
  });

  const handleNoteAdd = async () => {
    if (!newNote.trim()) return;
    await addNote(newNote);
    setNewNote('');
    fetchNotes();
  };

  const handleNoteEdit = (id, text) => {
    setEditingNote(prev => ({ ...prev, [id]: text }));
  };

  const handleNoteSave = async (id) => {
    await editNote(id, editingNote[id]);
    setEditingNote(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    fetchNotes();
  };

  const handleNoteDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Həftəlik Yemək Planı və Qeyd Siyahısı</h1>

      <div className={styles.grid}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.dayColumn}>
            <h3>{day}</h3>
            {mealTypes.map(type => (
              <div key={type} className={styles.mealBlock}>
                <div className={styles.inputGroup}>
                  <input
                    value={mealInputs[`${day}-${type}`] || ''}
                    onChange={(e) => handleMealChange(day, type, e.target.value)}
                    placeholder={`${type} üçün...`}
                  />
                  <button onClick={() => handleMealAdd(day, type)}>Əlavə et</button>
                </div>

                {(groupedMeals[day]?.[type] || []).map(item => (
                  <div key={item._id} className={styles.mealItem}>
                    {editingMeals[item._id] !== undefined ? (
                      <>
                        <input
                          value={editingMeals[item._id]}
                          onChange={(e) => handleMealEdit(item._id, e.target.value)}
                        />
                        <button onClick={() => handleMealSave(item._id)}>Yadda saxla</button>
                      </>
                    ) : (
                      <>
                        <span>{item.content}</span>
                        <button onClick={() => handleMealEdit(item._id, item.content)}>Dəyiş</button>
                        <button onClick={() => handleMealDelete(item._id)}>Sil</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* Bazar və Shopping List yan-yana durması üçün Shopping List də grid-in içindədir */}
        <div className={styles.notes}>
          <h2>Shopping List</h2>
          <div className={styles.newNote}>
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Yeni qeyd..."
            />
            <button onClick={handleNoteAdd}>Əlavə et</button>
          </div>
          <ul className={styles.noteList}>
            {notes.map(note => (
              <li key={note._id}>
                {editingNote[note._id] !== undefined ? (
                  <>
                    <input
                      value={editingNote[note._id]}
                      onChange={(e) => handleNoteEdit(note._id, e.target.value)}
                    />
                    <button onClick={() => handleNoteSave(note._id)}>Yadda saxla</button>
                  </>
                ) : (
                  <>
                    {note.text}
                    <button onClick={() => handleNoteEdit(note._id, note.text)}>Dəyiş</button>
                    <button onClick={() => handleNoteDelete(note._id)}>Sil</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
