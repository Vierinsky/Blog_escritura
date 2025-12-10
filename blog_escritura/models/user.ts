import mongoose, { Document, Model, Schema} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    bio?: string;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        bio: { type: String },
    },
    { timestamps: true }
);

// Avoids recompiling the model in hot-reload
const User: Model <IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;