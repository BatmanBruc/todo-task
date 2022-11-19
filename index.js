import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors'
//import router from './routers';
import config from './config.js'

const app = express();
app.use(express.json())
const port = config.server_port;

// app.use('/',cors({
//   origin: true
// }), router);
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

runDB().catch(err => console.log(err));

async function runDB() {
  await connect(config.db_domain + config.db_name);
}