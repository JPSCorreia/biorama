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

export const truncateDescription = (text, minLength = 225, maxLength = 275) => {
    if (text.length <= maxLength) return text; // Retorna o texto original se não ultrapassar o limite

    // Procurar o primeiro ponto final dentro do intervalo
    const cutoffIndex = text.slice(minLength, maxLength).lastIndexOf(".");
    if (cutoffIndex !== -1) {
        return text.slice(0, minLength + cutoffIndex + 1); // Corta no ponto final encontrado
    }

    // Se não encontrar um ponto final, corta nos 340 caracteres e adiciona "..."
    return text.slice(0, maxLength) + "...";
};


export const fixImagePath = (imagePath) => {
    if (!imagePath) return "/images/default-image.jpg"; // Coloca uma imagem padrão
    if (imagePath.startsWith("http")) return imagePath; // Se já for uma URL completa, retorna direto
    return `/storage/${imagePath.replace(/^storage\//, "")}`; // Remove prefixos extras
};

export function formatDateToPortuguese(dataISO) {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const data = new Date(dataISO);
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();

    return `${mes}, ${ano}`;
}
