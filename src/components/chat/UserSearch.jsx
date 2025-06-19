import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

function UserSearch({ onSelectUser }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      axiosInstance.get(`/auth/search?username=${query}`)
        .then(res => setResults(res.data))
        .catch(() => setResults([]));
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div>
      <input
        placeholder="İstifadəçi adı ilə axtar"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul>
        {results.map(user => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSearch;
