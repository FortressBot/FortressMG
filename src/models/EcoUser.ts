import { model, Schema } from "mongoose";

export default model('ecouser', new Schema({
    Guild: String,
    User: String,
    Wallet: Number,
    Bank: Number,
    Possessions: Array,
}))