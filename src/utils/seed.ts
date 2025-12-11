import User from "../modules/user/user.model";

// create super admin seed 
export const createSuperAdmin = async () => {

    // if super admin already exists then return 
    const isSuperAdmin = await User.findOne({ email: "superadmin@travbud.com" });
    if (isSuperAdmin) {
        console.log("😎 Super Admin already exists.");
        return;
    };

    const superAdmin = await User.create({
        name: "Super Admin",
        email: "superadmin@travbud.com",
        password: "123456",
        role: "admin",
        status: "active",
        gender: "Male",
        age: 25,
        currentLocation: "Dhaka, Bangladesh",
        bio: "I am super admin",
        about: "I am super admin",
        contactNumber: "01300000000",
        photo: "https://res.cloudinary.com/djzqzqzq/image/upload/v1702222222/placeholder.png",
    });
    if (!superAdmin) {
        console.log("Super Admin not created.");
        return;
    }
    console.log("Super Admin created successfully 🎉");
}


