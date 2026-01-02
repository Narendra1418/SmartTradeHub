const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true},
    email: {
        type: String,
        required: true,
        unique: true
        lowercase: true},
    password: {
        type: String,
        required: true
        select: false},
    avatarURL: {
        type: String},
    createdAt: {
        type: Date,
        default: Date.now}
    settings: {
        notification:{type: Boolean, default: true},
        timezone:{type: String, default: 'Asia/Kolkata'}
});