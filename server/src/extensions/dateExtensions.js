// Extender el prototipo de Date para incluir el método isValid
Date.prototype.isValid = function () {
  // Verifica si el objeto es una instancia de Date y si es una fecha válida
  if (!(this instanceof Date) || isNaN(this.getTime())) {
    return false;
  }

  // Verificar formatos específicos
  const dateString = this.toISOString().split("T")[0]; // YYYY-MM-DD
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{2} [A-Za-z]+ \d{4}$/, // DD Month YYYY
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|([+-]\d{2}:\d{2}))$/, // YYYY-MM-DDTHH:MM:SSZ
  ];

  return formats.some((regex) => regex.test(dateString)) && this.isValid();
};

// Extender el constructor Date para manejar diferentes formatos de fecha
Date.fromFormattedString = function (dateString) {
  // Primero, intentamos con formato ISO (YYYY-MM-DD)
  let date = new Date(dateString);
  if (date.isValid()) {
    return date;
  }

  // Intentar con formato MM/DD/YYYY
  const mdyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (mdyRegex.test(dateString)) {
    const [month, day, year] = dateString
      .split("/")
      .map((num) => parseInt(num, 10));
    date = new Date(year, month - 1, day); // Mes - 1 porque en JavaScript los meses van de 0 a 11
    if (
      date.isValid() &&
      date.getDate() === day &&
      date.getMonth() + 1 === month
    ) {
      return date;
    }
  }

  // Intentar con formato DD/MM/YYYY
  const dmyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (dmyRegex.test(dateString)) {
    const [day, month, year] = dateString
      .split("/")
      .map((num) => parseInt(num, 10));
    date = new Date(year, month - 1, day); // Mes - 1 porque en JavaScript los meses van de 0 a 11
    if (
      date.isValid() &&
      date.getDate() === day &&
      date.getMonth() + 1 === month
    ) {
      return date;
    }
  }

  // Intentar con formato con texto de mes (DD Month YYYY)
  const monthTextRegex = /^\d{2} [A-Za-z]+ \d{4}$/;
  if (monthTextRegex.test(dateString)) {
    date = new Date(dateString);
    if (date.isValid()) {
      return date;
    }
  }

  // Intentar con formato con hora (YYYY-MM-DDTHH:MM:SSZ)
  const isoWithTimeRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|([+-]\d{2}:\d{2}))$/;
  if (isoWithTimeRegex.test(dateString)) {
    date = new Date(dateString);
    if (date.isValid()) {
      return date;
    }
  }

  // Si no coincide con ningún formato
  return null;
};
