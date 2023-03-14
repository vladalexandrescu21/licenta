import express,{json}  from "express";
import cors from "cors";
import initialize from "./repository.mjs";

const app = express();
app.use(cors());
app.use(json());

app.listen(8080, async () => {
    try{
        console.log("listening on 8080");
        await initialize();
    }catch(error){
        console.error(error);
    }
})