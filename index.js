const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Ruta para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// GET /canciones: Devuelve el repertorio
app.get('/canciones', (req, res) => {
    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// POST /canciones: Agrega una nueva canción
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;

    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }

        const canciones = JSON.parse(data);
        canciones.push(nuevaCancion);

        fs.writeFile('./repertorio.json', JSON.stringify(canciones, null, 2), err => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.status(201).send('Canción agregada');
        });
    });
});

// PUT /canciones/:id: Edita una canción existente
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancionActualizada = req.body;

    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }

        let canciones = JSON.parse(data);
        const index = canciones.findIndex(c => c.id == id);

        if (index === -1) {
            res.status(404).send('Canción no encontrada');
            return;
        }

        canciones[index] = cancionActualizada;

        fs.writeFile('./repertorio.json', JSON.stringify(canciones, null, 2), err => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.send('Canción actualizada');
        });
    });
});

// DELETE /canciones/:id: Elimina una canción por ID
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
            return;
        }

        let canciones = JSON.parse(data);
        canciones = canciones.filter(c => c.id != id);

        fs.writeFile('./repertorio.json', JSON.stringify(canciones, null, 2), err => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo');
                return;
            }
            res.send('Canción eliminada');
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

