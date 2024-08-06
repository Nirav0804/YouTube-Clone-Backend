import { asyncHandler } from "../utils/asyncHandler.js"


const registerUsesr = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "Ok"
    });
});

export { registerUsesr };