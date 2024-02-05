import Listing from "../models/listing.model.js";
import { errorhandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
    }

    if (req.user.userId !== listing.userRef) {
        return next(errorhandler(401, "You are not authorized to delete this listing"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing deleted successfully');
    } catch (error) {
        next(error);
    }
};