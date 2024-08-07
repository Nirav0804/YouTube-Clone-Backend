import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUsesr = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with  email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let converImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        converImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        console.log("hello0");
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(converImageLocalPath)

    if (!avatar) {
        console.log("hello")
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went the user while registering the user")
    }
    console.log(createdUser);
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
});

export { registerUsesr };