import { observer } from 'mobx-react';
import DeleteIcon from '@mui/icons-material/Delete';
import { stringAvatar } from '../utils/utils';
import { usersStore } from '../Stores/usersStore';
import Tooltip from '@mui/material/Tooltip';
import {
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
} from '@mui/material';
import { useEffect, useRef } from 'react';

const User = observer(({ user, index }) => {
    const deleteUser = () => {
        usersStore.deleteUser(index);
    };

    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            console.log('User mounted');
        } else {
            console.log('User re-rendered');
        }
    });

    return (
        <>
            <ListItem
                secondaryAction={
                    <Tooltip title="Delete">
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={deleteUser}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
            >
                <ListItemAvatar>
                    <Avatar {...stringAvatar(user.name)} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.id} />
            </ListItem>
            {index < usersStore.users.length - 1 && <Divider component="li" />}
        </>
    );
});

export default User;
