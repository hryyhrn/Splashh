const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paletteSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    paletteName: {
        type: String,
        required: true,
        maxlength: 10
    },
    colour1: {
        type: String,
        required: true
    },
    colour2: {
        type: String,
        required: true
    },
    colour3: {
        type: String,
        required: true
    },
    colour4: {
        type: String,
        required: true
    }
});

paletteSchema.index({ username: 1, paletteName: 1 }, { unique: true });

const Palette = mongoose.model('Palette', paletteSchema);
module.exports = Palette;