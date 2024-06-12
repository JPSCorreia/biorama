import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import UsersList from './UsersList';
import UsersButtons from './UsersButtons';
import { useEffect, useRef } from 'react';

const UsersContainer = observer(() => {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            console.log('UsersContainer mounted');
        } else {
            console.log('UsersContainer re-rendered');
        }
    });

    return (
        <>
            <h1>Users</h1>
            <Box sx={{ mt: 3 }}>
                <UsersButtons />
                <UsersList />
            </Box>
        </>
    );
});

export default UsersContainer;
