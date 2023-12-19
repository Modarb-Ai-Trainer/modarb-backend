
import { app } from "./configs/app"
import http from 'http';

const server = http.createServer(app);

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is up and runing on port ${process.env.PORT}!`)
})


