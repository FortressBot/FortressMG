import { model, Schema } from "mongoose";

export default model('ecoguild', new Schema({
    Guild: String,
    ItemName: String,
    ItemCost: Number,
    ItemDescription: String,
}))