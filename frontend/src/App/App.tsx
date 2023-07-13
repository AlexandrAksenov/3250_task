import React, { useState, useEffect } from 'react';
import './App.css';

type UserData = {
  email: string;
  number: string;
};

function App(): JSX.Element {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    () => () => {
      // Отмена предыдущего запроса при размонтировании компонента
      if (loading) {
        setLoading(false);
      }
    },
    [loading]
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (loading) {
      // Отмена предыдущего запроса, если он еще обрабатывается
      return;
    }

    // Валидация полей
    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, number }),
      });

      const data: UserData[] = await response.json();
      if (data.length !== 0) {
        setSearchResults(data);
      }
      setError('Пользователь с таким номером или почтой не найден');

      setSearchResults(data);
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form_title">Поиск</h1>
        <div className="form_group">
          <input
            className="form_input"
            placeholder="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form_group">
          <input
            className="form_input"
            type="text"
            value={number}
            pattern="\d{2}-\d{2}-\d{2}"
            placeholder="Пример: 22-11-22"
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <button className="form_button" type="submit">
          Искать
        </button>
      </form>

      {loading && <div className="div_status">Загрузка...</div>}
      {error && <div className="div_status">Ошибка: {error}</div>}
      {searchResults.length > 0 && (
        <div className="div_status">
          <h2>Результаты поиска:</h2>
          <ul>
            {searchResults.map((user) => (
              <li key={user.number.toString()}>
                Email: {user.email}, Number: {user.number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
