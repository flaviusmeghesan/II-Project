import Listing from "../models/listing.model.js";

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
    if(req.user.id !== listing.userRef){
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing deleted");
    } catch (error) {
        next(error);
    }
}