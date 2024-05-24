const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vacantes_react'
})



app.use(cors());
app.use(express.json());
app.listen(3001, () => {
    console.log('listening on 3001')
})

app.get('/', (req, res) => {
    res.send({ status: 200 });
})

//empresa
app.post('/company', (req, res) => {
    const company = req.body.company
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const logo = req.body.logo
    db.query(`INSERT INTO company (company,username,email,password,logo) VALUES(?,?,?,md5(?),?)`, [company, username, email, password, logo],
        (err, result) => {
            if (err) {
                res.send({
                    status: 400,
                    message: err
                })
            }
            else {
                res.send({
                    status: 201,
                    message: 'Empresa creada con éxito',
                    data: result
                })
            }
        }
    );


})

app.get('/company/:id', (req, res) => {
    const companyId = req.params.id
    db.query(`SELECT company_id,company,username,email,logo FROM company WHERE company_id=${companyId}`,
        (err, result) => {
            if (result.length > 0) {
                res.status(200)
                    .send(result[0])
            }
            else {
                res.status(400).send({
                    message: 'No existe la empresa'
                })
            }
        }
    );


})

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.query(`SELECT company_id,company,username,email,logo FROM company WHERE email=? AND password=md5(?)`, [email, password],
        (err, result) => {
            if (err) {
                res.send({
                    status: 500,
                    message: err
                })
            }
            else {
                if (result.length > 0) {
                    res.status(200)
                        .send(result[0])
                }
                else {
                    res.status(401).send({
                        status: 401,
                        message: 'Usuario o contraseña incorrectos'
                    })
                }
            }
        }
    );


})

//vacantes
app.post('/job', (req, res) => {
    const title = req.body.title
    const from_date = req.body.from_date
    const until_date = req.body.until_date
    const city = req.body.city
    const job_type = req.body.job_type
    const experience = req.body.experience
    const company_id = req.body.company_id
    db.query(`INSERT INTO job (title,from_date,until_date,city,job_type,experience,company_id) VALUES(?,?,?,?,?,?,?)`, [title, from_date, until_date, city, job_type, experience, company_id],
        (err, result) => {
            if (err) {
                res.status(400)
                    .send({
                        message: err
                    })
            }
            else {
                res.send({
                    status: 201,
                    message: 'Vacante creada con éxito',
                    data: result
                })
            }
        }
    );

})

app.get('/job/:id', (req, res) => {
    const id = req.params.id
    db.query(`SELECT * FROM job WHERE job_id=${id}`,
        (err, result) => {
            if (result.length > 0) {
                res.status(200)
                    .send(result[0])
            }
            else {
                res.status(400).send({
                    message: 'No existe la vacante'
                })
            }
        }
    );
})

app.get('/job/all/:company_id/:page/:limit', (req, res) => {
    const id = req.params.company_id
    const page = req.params.page
    const limit = req.params.limit
    const start = (page - 1) * limit
    db.query(`SELECT * FROM job WHERE company_id=${id} AND deleted=0 ORDER BY job_id DESC limit ${start}, ${limit} `,
        (err, result) => {
            if (result.length >= 0) {
                res.status(200)
                    .send(result)
            }
            else {
                res.status(400).send({
                    message: 'No hay vacantes'
                })
            }
        }
    );
})

app.get('/job/all/:page/:limit', (req, res) => {
    const page = req.params.page
    const limit = req.params.limit
    const start = (page - 1) * limit
    db.query(`SELECT DATEDIFF(J.until_date,(SELECT now())) as dias, J.*,C.company,C.logo FROM job J INNER JOIN company C ON C.company_id=J.company_id WHERE deleted=0 ORDER BY job_id DESC limit ${start}, ${limit} `,
        (err, result) => {
            if (result.length > 0) {
                res.status(200)
                    .send(result)
            }
            else {
                res.status(400).send({
                    message: 'No hay vacantes'
                })
            }
        }
    );
})

app.put('/job/:id', (req, res) => {
    const id = Number(req.params.id)
    const title = req.body.title
    const from_date = req.body.from_date
    const until_date = req.body.until_date
    const city = req.body.city
    const job_type = req.body.job_type
    const experience = Number(req.body.experience)
    const company_id = Number(req.body.company_id)
    db.query(
        'SELECT company_id FROM job WHERE job_id = ?', [id],
        (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error fetching job data:', selectErr);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            if (!selectResult || selectResult.length === 0) {
                return res.status(404).send({ message: 'Vacante no encontrada' });
            }

            const companyIdFromDatabase = selectResult[0].company_id;

            // 2. Verificar si los company_id coinciden
            if (company_id !== companyIdFromDatabase) {
                return res.status(403).send({ message: 'No autorizado para actualizar esta vacante' });
            }

            // 3. Si coinciden, proceder con la actualización
            db.query(
                'UPDATE job SET title = ?, from_date = ?, until_date = ?, city = ?, job_type = ?, experience = ? WHERE job_id = ? AND company_id = ?',
                [title, from_date, until_date, city, job_type, experience, id, company_id],
                (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating job:', updateErr);
                        return res.status(500).send({ message: 'Error interno del servidor' });
                    }

                    res.status(200).send({
                        message: 'Vacante actualizada con éxito',
                    });
                }
            );
        }
    );

})

app.delete('/job/:id', (req, res) => {
    const id = Number(req.params.id)
    const company_id = Number(req.body.company_id)
    db.query(
        'SELECT company_id FROM job WHERE job_id = ?', [id],
        (selectErr, selectResult) => {
            if (selectErr) {
                console.error('Error fetching job data:', selectErr);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }

            if (!selectResult || selectResult.length === 0) {
                return res.status(404).send({ message: 'Vacante no encontrada' });
            }

            const companyIdFromDatabase = selectResult[0].company_id;

            // 2. Verificar si los company_id coinciden
            if (company_id !== companyIdFromDatabase) {
                return res.status(403).send({ message: 'No autorizado para borrar esta vacante' });
            }

            // 3. Si coinciden, proceder con la actualización
            db.query(
                'UPDATE job SET deleted=1 WHERE job_id = ? AND company_id = ?',
                [id, company_id],
                (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating job:', updateErr);
                        return res.status(500).send({ message: 'Error interno del servidor' });
                    }

                    res.status(200).send({
                        message: 'Vacante borrada con éxito',
                    });
                }
            );
        }
    );
})

//personas
app.post('/persons', async (req, res) => {
    const { dni, name, email, img } = req.body;

    try {
        // Verificar si la persona ya existe
        const [existingPerson] = await db.promise().query('SELECT * FROM persons WHERE dni = ?', [dni]);

        if (existingPerson.length > 0) {
            return res.status(200).send(existingPerson[0]);
        }

        // Insertar nueva persona
        const [result] = await db.promise().query(
            'INSERT INTO persons (dni, name, email, img) VALUES (?, ?, ?, ?)',
            [dni, name, email, img]
        );

        res.status(201).send({
            status: 201,
            message: 'Persona creada con éxito',
            data: {
                person_id: result.insertId // Enviar el ID de la persona creada
            }
        });
    } catch (err) {
        console.error('Error al crear persona:', err);
        res.status(500).send({ message: 'Error interno del servidor', error: err.message });
    }
});



//postulaciones
app.post('/apply', (req, res) => {
    const { job_id, persons_id, salary } = req.body; // Utiliza person_id

    db.query(
        'INSERT INTO job_persons_apply (job_job_id, persons_id, salary) VALUES (?, ?, ?)',
        [job_id, persons_id, salary],
        (err, result) => {
            if (err) {
                console.error('Error al insertar la postulación:', err);
                return res.status(500).send({ message: 'Error interno del servidor' });
            }
            res.status(201).send({
                status: 201,
                message: 'Postulación registrada con éxito',
                data: result
            });
        }
    );
});

app.put('/apply/:job_id/:persons_id', (req, res) => {
    const job_id = req.params.job_id
    const persons_id = req.params.persons_id
    const deleted = req.body.deleted
    const selected = req.body.selected
    db.query(`UPDATE job_persons_apply SET deleted=?,selected=? WHERE persons_id=? AND job_job_id=?`, [deleted, selected, persons_id, job_id],
        (err, result) => {
            if (err) {
                res.status(400)
                    .send({
                        message: err
                    })
            }
            else {
                res.send({
                    status: 201,
                    message: 'Postulación actualizada con éxito',
                    data: result
                })
            }
        }
    );

})

app.get('/applications/:jobId', (req, res) => {
    const jobId = req.params.jobId
    db.query(`SELECT J.title,P.*,JPA.salary FROM persons P
            INNER JOIN job_persons_apply JPA ON JPA.persons_id=P.person_id
            INNER JOIN job J ON J.job_id=JPA.job_job_id
            WHERE J.job_id=${jobId}`,
        (err, result) => {
            if (result.length > 0) {
                res.status(200)
                    .send(result)
            }
            else {
                res.status(400).send({
                    message: 'No hay postulaciones'
                })
            }
        }
    );


})

app.get('/empresas', (req, res) => {
    const jobId = req.params.jobId
    db.query(`SELECT C.company,C.logo,C.username,C.create_time,C.company_id FROM company C`,
        (err, result) => {
            if (result.length > 0) {
                res.status(200)
                    .send(result)
            }
            else {
                res.status(400).send({
                    message: 'No hay empresas'
                })
            }
        }
    );


})

app.get('/job/all/:company_id', (req, res) => {
    const id = req.params.company_id
    db.query(`SELECT * FROM job WHERE company_id=${id} AND deleted=0 ORDER BY job_id DESC `,
        (err, result) => {
            if (result.length > 0) {
                res.status(200)
                    .send(result)
            }
            else {
                res.status(400).send({
                    message: 'No hay vacantes'
                })
            }
        }
    );
})

app.get('/company/:id', (req, res) => {
    const companyId = req.params.id;

    db.query(
        'SELECT company_id, company, username, email, logo, create_time FROM company WHERE company_id = ?',
        [companyId],
        (err, result) => {
            if (err) {
                console.error('Error al obtener la empresa:', err);
                return res.status(500).send({ message: 'Error interno del servidor', error: err.message });
            }

            if (result.length === 0) { // Si no se encuentra la empresa
                return res.status(404).send({ message: 'Empresa no encontrada' });
            } else {
                res.status(200).send(result[0]);
            }
        }
    );
});