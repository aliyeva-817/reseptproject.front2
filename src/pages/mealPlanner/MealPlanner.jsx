import React, { useEffect, useState } from 'react';
import {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
} from '../../services/api';
import styles from './MealPlanner.module.css';
import { FaPlus } from "react-icons/fa";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import GreenLoader from '../../components/common/GreenLoader';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const data = await getMeals();
      setMeals(data);
    } catch (err) {
      console.error('Yeməklər alınmadı:', err);
    } finally {
      setIsLoading(false);
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

  if (isLoading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Həftəlik Yemək Planı</h1>

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
                  <button className={styles.addbtn} onClick={() => handleMealAdd(day, type)}>
                    <FaPlus />
                  </button>
                </div>

                {(groupedMeals[day]?.[type] || []).map(item => (
                  <div key={item._id} className={styles.mealItem}>
                    {editingMeals[item._id] !== undefined ? (
                      <>
                        <input
                          value={editingMeals[item._id]}
                          onChange={(e) => handleMealEdit(item._id, e.target.value)}
                        />
                        <button  onClick={() => handleMealSave(item._id)}><FaCheck /></button>
                      </>
                    ) : (
                      <>
                        <span>{item.content}</span>
                        <div className={styles.qutu}>
                          <button className={styles.sil} onClick={() => handleMealEdit(item._id, item.content)}>
                            <MdModeEdit />
                          </button>
                          <button className={styles.sil} onClick={() => handleMealDelete(item._id)}>
                            <MdDelete />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
