//dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path:'.env'})
}

//express 
const express = require('express');
const app = express();

//body-parser
const bodyParser = require('body-parser');
//mongoose connect
//mongoose 비동기
const mongoose = require('mongoose')
const id = process.env.ID 
console.log(id)
const pw = encodeURIComponent(process.env.PW)
console.log(pw)
mongoose.connect(`mongodb+srv://${id}:${pw}@cluster0.zrxi5.mongodb.net/myFirstDatabase?retryWrites=true` , {
    useNewUrlParser: true , 
    useUnifiedTopology: true
}).then(() => {
    console.log('mongoDB connected!!')
}).catch(err => {
    console.log('Failed to connect to MongoDB' , err);
})

//method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
//schema 불러오기
const UrlSchema = require('./src/module/ShortUrlSchema');
const { listenerCount } = require('./src/module/ShortUrlSchema');

//body-parser
app.use(bodyParser.urlencoded({extended: false}))
//public middleware
app.use(express.static(`${__dirname}/src/public`))

//view engine
app.set('views' , 'src/views');
app.set('view engine' , 'ejs');

app.get('/' , async (req , res) => {
    const Urls = await UrlSchema.find();
    res.render('index' , {Urls : Urls})
})

app.post('/shortUrl' , async (req , res) => {
    await UrlSchema.create({full : req.body.fullUrl})
    res.redirect('/')
})


app.get('/:shortId' , async (req , res) => {
     const Urls = await UrlSchema.findOne({short: req.params.shortId});
     if(Urls == null){
       return  res.status(404).send('')
     }

     Urls.clicks ++ 
     Urls.save();

     res.redirect(Urls.full)
})



app.get('/edit/:id' , async ( req ,res) => {
    try{
        let Urls = await UrlSchema.findById(req.params.id);
        res.render('edit' , {Urls: Urls} );
    }catch(e){
        console.log(e)
    }
})





app.put('/:id' , async (req , res) => {
        req.Url = UrlSchema.findById(req.params.id);

        try{
            let url = await req.Url;
            url.full = req.body.fullUrl;
            url = await url.save();
            res.redirect('/');
        }catch(error){
            console.log(error);
            res.redirect('/');
        }
})









app.delete('/:id' , async (req , res) => {
    try{
        await UrlSchema.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }catch(error){
        console.log(error)
    }
})


const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`${port}포트 포트로 이동중.......`)
})