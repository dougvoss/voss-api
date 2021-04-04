const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


require('./routes')(app);



app.listen(process.env.PORT || 3000);