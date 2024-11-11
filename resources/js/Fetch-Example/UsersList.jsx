import { observer } from 'mobx-react';
import { usersStore } from '../Stores/usersStore';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import User from './User';

const UsersList = observer(() => {
  return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
        Users
      </Typography>
      <Typography sx={{ mt: 1, mb: 1 }} variant="subtitle2" component="div">
        Total: {usersStore.total}
      </Typography>
      <List
        sx={{
          p: 0,
          width: '100%',
          // maxWidth: 360,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
        dense={false}
      >
        {usersStore.users.map((user, index) => (
          <User user={user} key={index} index={index} />
        ))}
      </List>
    </Grid>
  );
});

export default UsersList;
