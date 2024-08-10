# Puntaje Eventos Web



## Si no funciona la llamada a la API/Backend
Probar configurar los siguientes paso de a uno.

### Despues de crear el cliente
```
// client/package.json
...
{
    ...
    "scripts":{
        ...
    }
    "proxy": "http://localhost:3001",
    ...
}
```

### Realiza peticiones HTTP desde React a Node

```
fetch("/api")
      .then((res) => if(res.status === 200)? res.json(): throw)
      .then((data) => console.log(data.message))
      .catch((err) => console.error(err);
```

### Verificaciónes
Asegurarse de no tener un repositorio git en el cliente
```
cd client
rm -rf .git
```


## REFERENCIAS

#### React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
