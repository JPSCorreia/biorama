import { Box, Button, TextField } from '@mui/material';
import { usersStore } from '../Stores/usersStore';
import { useEffect, useState, useRef } from 'react';


const UsersButtons = () => {

    const [inputValue, setInputValue] = useState('');
    const [errorState, setErrorState] = useState(false);
    const [helperText, setHelperText] = useState(' ');
    const hasMounted = useRef(false);

    const addUser = () => {
        if (inputValue.length > 0) {
          usersStore.addUser(inputValue);
          setInputValue('');
        } else {
          setErrorState(true);
          setHelperText('Please enter a name');
        }
      };
      const fetchUser = () => {
        if (inputValue.length > 0) {
          usersStore.fetchUser(inputValue);
          setInputValue('');
        } else {
          setErrorState(true);
          setHelperText('Please enter an id');
        }
      };
      const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          addUser();
        }
      };
    
      const handleChange = (event) => {
        setErrorState(false);
        setHelperText(' ');
        setInputValue(event.target.value);
      };

      useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            console.log('UsersButtons mounted');
        } else {
            console.log('UsersButtons re-rendered');
        }
    });

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                required
                error={errorState}
                helperText={helperText}
                label="name"
                variant="outlined"
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
            />
            <Button sx={{ ml: 2 }} variant="contained" onClick={addUser}>
                Add user
            </Button>
            <Button sx={{ ml: 2 }} variant="contained" onClick={fetchUser}>
                Fetch user
            </Button>
            <Button
                sx={{ ml: 2 }}
                variant="contained"
                onClick={usersStore.clearUsers}
            >
                Clear users
            </Button>
        </Box>
    );
};

export default UsersButtons;
