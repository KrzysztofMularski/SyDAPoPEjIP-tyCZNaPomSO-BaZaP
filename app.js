const express = require('express');
const app = express();
const port = 3000;

app.use('/public', express.static('public'))

app.get('/', (_, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})