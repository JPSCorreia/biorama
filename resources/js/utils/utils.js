function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  const hasSpace = str => str.includes(' ') ? true : false;
  const firstInitial = name[0][0];
  const lastNameInitial = hasSpace(name) ? name.split(' ')[name.split(' ').length - 1][0] : '';
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${firstInitial}${lastNameInitial}`,
    // children: `${name[0][0]}${hasSpace(name)? name.split(' ')[name.split(' ').length - 1][0] : ''}`,
  };
}
