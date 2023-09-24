import express from 'express';
import { engine } from 'express-handlebars';;
import path from 'path';
import { __dirname } from './path.js';
import ManagerProducts from './models/ManagerProducts.js';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session'
import sessionRouter from './routes/session.routes.js'
import userRouter from './routes/users.routes.js'
import MongoStore from 'connect-mongo'
import 'dotenv/config'


mongoose.connect('mongodb+srv://christianjavierbergero:kPX5vgj9ewJ7sN59@cluster0.vb2rx0e.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {

        console.log('BDD conectada');
      
        /*
        await productModel.create([
            {title: "Arroz", description: "Arroz Fino", price: 450, stock: 1050, category: "Alimentos", code: "AA100", thumbnails: "Sin"},
            {title: "Fideos", description: "Fideos sin TAC", price: 850, stock: 2031, category: "Alimentos", code: "FF100", thumbnails: "Sin"},
            {title: "Yogourt", description: "Descremado", price: 750, stock: 230, category: "Lácteos", code: "YY100", thumbnails: "Sin"},
            {title: "Mayonesa", description: "Light", price: 956, stock: 624, category: "Aderezos", code: "MM300", thumbnails: "Sin"},
            {title: "Salsa Golf", description: "Clásica", price: 487, stock: 596, category: "Aderezos", code: "SG200", thumbnails: "Sin"},
            {title: "Mostasa", description: "Clásica", price: 450, stock: 1050, category: "Aderezos", code: "MZ100", thumbnails: "Sin"},
            {title: "Azúcar", description: "Refinada", price: 154, stock: 639, category: "Otros", code: "AZ854", thumbnails: "Sin"},
            {title: "Sal", description: "Sal Marina", price: 896, stock: 78, category: "Otros", code: "SS541", thumbnails: "Sin"},
            {title: "Aceite", description: "Aceite Oliva", price: 969, stock: 896, category: "Cocina", code: "AC485", thumbnails: "Sin"},
            {title: "Vinagre", description: "Manzana", price: 563, stock: 417, category: "Cocina", code: "VM155", thumbnails: "Sin"},
            {title: "Vinagre", description: "Alcohol", price: 590, stock: 633, category: "Cocina", code: "VA744", thumbnails: "Sin"},
            {title: "Galletas", description: "Dulces", price: 250, stock: 362, category: "Alimentos", code: "GG123", thumbnails: "Sin"},
            {title: "Coca Cola", description: "Light", price: 958, stock: 1454, category: "Bebidas", code: "CC111", thumbnails: "Sin"},
            {title: "Pepsi", description: "Light", price: 1000, stock: 325, category: "Bebidas", code: "PP110", thumbnails: "Sin"},
            {title: "Pritty", description: "Limón", price: 450, stock: 1050, category: "Bebidas", code: "PY555", thumbnails: "Sin"},
            {title: "Fernet", description: "Fernet Branca", price: 450, stock: 1050, category: "Bebidas Alcohólicas", code: "BR111", thumbnails: "Sin"},
            {title: "Lecha", description: "Descremada", price: 142, stock: 1050, category: "Lácteos", code: "LC152", thumbnails: "Sin"},
            {title: "Arroz", description: "Arroz Fino", price: 450, stock: 1050, category: "Alimentos", code: "AA100", thumbnails: "Sin"},
            {title: "Arroz", description: "Arroz Fino", price: 450, stock: 1050, category: "Alimentos", code: "AA100", thumbnails: "Sin"},
            {title: "Arroz", description: "Arroz Fino", price: 450, stock: 1050, category: "Alimentos", code: "AA100", thumbnails: "Sin"}
        ]);
        */



    } )
    .catch((error) => console.log(`Error de conexión: ${error}`))




const app = express();

//Middleware
app.use(express.json()); // Convertir lo que está en el body que son string JSon , en objetos javascript
app.use(express.urlencoded({extended:true})) //Para manejar URL extensas
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea mediante URL
            useUnifiedTopology: true //Manego de clusters de manera dinamica
        },
        ttl: 60 //Duracion de la sesion en la BDD en segundos

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos. Cuando está en true.
    saveUninitialized: false //Fuerzo a guardar la session a pesar de no tener ningun dato. Cuando está en true
                            
    //Al estar resave y saveUnitialized en false, sólo se guardará la sessión cuando se hagan modificaciones, 
    //en nuestro ejemplo cuando se ingrese mail y contraseña correctos, en ese momemento le agregamos una propiedad sessión que 
    // session.login; provocando un cambio en sessión y por lo tanto guardando la sessión en mongo db
}))

//Routes
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionRouter)




//Configuración carpeta estática
app.use('/', express.static(path.join(__dirname, '/public')))

//configuración handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))


const PORT = 4000;

const server = app.listen(PORT, () => {console.log(`Server on PORT ${PORT} : http://localhost:4000/`)});

//Usuamos socket.io

const io = new Server(server);

app.get('/', async (req, res) => {
    try {
        const manager = new ManagerProducts();
        //const data = await manager.getProducts();
        const data = await manager.getProducts();
        res.render('home', {
            data,
            css: 'style.css',
            tittle: 'Products'
        }); // Renderiza la página HTML y pasa los datos como contexto
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});






app.get('/realtimehandlebars', async (req, res) => {
    try {
        const manager = new ManagerProducts();
        //const data = await manager.getProducts();
        
        const data = await manager.getProducts(); 
        
        

        res.render('realTimeProducts', {
            data,
            css: 'style.css',
            tittle: 'Products'
        }); // Renderiza la página HTML y pasa los datos como contexto
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



io.on('connection', (socket) => {
    console.log("Servidor socket.io conectado!!");
    
    socket.on("agregarProducto", async(prod) => {
        
        const managerProducts = new ManagerProducts();
        
        let mensaje = "Mensaje del servidor"

        if(await managerProducts.isCodeExisting(prod.code)){
            mensaje = `El código "${prod.code}" ya existe. Producto no agregado!!`
        }else if(!managerProducts.validateProduct(prod)){
            mensaje = "Hay campos obligatorios sin completar. Producto no agregado!!";
        }else{
            await managerProducts.addProduct(prod);
            mensaje = "Producto agregado con éxito!!"
        }
        console.log(`Este es un mensaje: ${mensaje}`)
    
        
        socket.emit('mostrarProducto', mensaje)
    });
   
    socket.on("eliminarProducto", async (code)=>{
        const managerProducts = new ManagerProducts();
        let mensaje = "";
        if (code === NaN || !await managerProducts.isCodeExisting(code)){
            mensaje = `El producto no existe para ser Eliminado!!`
        }else{
            
            await managerProducts.deleteProductByCode(code)
            mensaje = `El producto con CODE ${code} fue eliminado con éxito!!`
        }

        socket.emit("mostrarEliminado", mensaje)
    })
   
    
})



