import { useSelector } from 'react-redux';
import axios from 'axios';

const Add = () => {
  const { token } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await axios.post('http://localhost:5000/api/recipes', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    alert("Resept əlavə olundu!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Başlıq" />
      <input name="ingredients" placeholder="un, yumurta..." />
      <textarea name="instructions" placeholder="Hazırlanma" />
      <input type="file" name="image" />
      <button>Əlavə et</button>
    </form>
  );
};

export default Add;
