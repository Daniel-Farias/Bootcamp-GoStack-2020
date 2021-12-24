import React, { useState, useEffect} from "react";
import api from './services/api';
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState('');

  function loadRepos() {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  }

  useEffect(() => {
    loadRepos();
  }, [])

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: title,
      url: url,
      techs: techs
    }).then(response => {
      setRepositories([...repositories, response.data]);
    })
  }

  async function handleRemoveRepository(id) {
    const listFiltered = repositories.filter(repository => repository.id !== id);
    await api.delete(`/repositories/${id}`, {
      title: title,
      url: url,
      techs: techs
    });
    setRepositories(listFiltered);
  }

  return (
    <div>
      <ul data-testid="repository-list">
          {repositories.map(repository => (
            <li key={repository.id}>{repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          ))}
      </ul>

      <input placeholder="TITLE" value={title} onChange={(e) => { setTitle(e.target.value) }} />
      <input placeholder="URL" value={url}onChange={(e) => { setUrl(e.target.value) }} />
      <input placeholder="TECHS" value={techs}onChange={(e) => { setTechs(e.target.value) }} />
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
