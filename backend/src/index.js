const express = require('express');
const cors = require('cors');
const routes = require('./routes');//para entender que routes é um arquivo e nao um pacote como o express

const app = express();

app.use(cors()); // vai permitir que o front-end tenha acesso. dentro do cors() da para por {origin: 'http://nomedosite.com'} quando for hospeado
app.use(express.json());
app.use(routes);

app.listen(3333);