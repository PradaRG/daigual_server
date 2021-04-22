# SERVIDOR EXPRESS -- APP DE INVENTARIADO

### SETUP:

- Instalar [**Redis**](https://redislabs.com/blog/redis-on-windows-10/).
- Iniciar Redis via terminal utilizando el comando redis-server.
- Clonar el repositorio.  
- Abrir la carpeta del proyecto desde la consola.
    - Ejecutar el comando npm `install`.
- Crear una base de datos para conectar con Sequelize.      
- Crear un archivo .env con las siguientes variables:
>   - **PUERTO**               *(Puerto donde va a correr el servidor)*
>   - **DBNAME**                *(Nombre de la base de datos a la que conectar)*
>   - **DBUSER**                  *(nombre de usuario para la base de datos)*
>   - **DB_PASSWORD**           *(Contraseña del usuario de la base de datos)*
>   - **DB_TYPE**               *(Uno de los [siguientes](https://sequelize.org/master/manual/dialect-specific-things.html))*
>   - **NODE_ENV**              *("dev", "production")*
>   - **ACCESS_TOKEN_SECRET**   *(Clave secreta para encriptar los tokens)*
>   - **REFRESH_TOKEN_SECRET**  *(Clave secreta para encriptar los tokens de refresco)*
- Ejecutar `npm start`.

### NOTAS:

> - Componer contenedor Docker listo para usar todo, para facilitar Setup.