import { UserImage } from "./user.image";

export class User {
    id: string;
    display_name: string;
    email: string;
    href: string;
    images: UserImage[];
}
