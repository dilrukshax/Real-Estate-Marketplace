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

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorhandler(404, 'Listing not found!'));
    }
    if (req.user.userId !== listing.userRef) {
      return next(errorhandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

export const GetListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorhandler(404, "Listing not found"));
        }
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};
  