const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    emailUsuario: {
        type: String,
        required: true,
    },
    texto: {
        type: String,
        required: true,
    },
    calificacion: {
        type: Array,
        required: false,
    }
});

ComentarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Comentario', ComentarioSchema);