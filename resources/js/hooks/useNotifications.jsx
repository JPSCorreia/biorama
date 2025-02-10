import { useEffect, useState } from 'react';
import axios from 'axios';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('/notifications')
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Erro ao buscar notificações', error));
  }, []);

  return { notifications, setNotifications };
};

export default useNotifications;
