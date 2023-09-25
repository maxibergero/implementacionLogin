import { Router } from "express";
import { userModel } from "../models/users.models.js";






const sessionRouter = Router()



sessionRouter.post('/login', async (req, res) => {

    const { email, password } = req.body; 

    try {
        if (req.session.login) {
            //res.status(200).send({ resultado: 'Login ya existente' })
        }
        const user = await userModel.findOne({ email: email })

        if (user) {
            if (user.password == password) {
                req.session.login = true
                console.log("Login válido!!")
                res.status(200).json({ resultado: true, message: 'Login válido' });
            } else {
                
                res.status(401).json({ resultado: false, message: 'Contraseña no válida' });
                
            }
        } else {
            res.status(404).send({ resultado: false, message: 'El Usuario no existe' })
        }

    } catch (error) {
        res.status(400).send({ error: `Error en Login: ${error}` })
    }
})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    //res.status(200).send({ resultado: 'Usuario deslogueado' })
    res.redirect('/api/sessions')
})

sessionRouter.get('/', (req, res) => {
    res.render("session", {
        css: 'session.css',
        script: 'session.js'
    })
}) 

export default sessionRouter