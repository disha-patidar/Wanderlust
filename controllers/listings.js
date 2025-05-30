const Listing=require("../models/listing");


module.exports.index=async(req,res)=>{
  const allListings=await Listing.find({});
  res.render("listings/index",{allListings});
};

module.exports.renderNewForm=async(req,res)=>{
res.render("../views/listings/new");
};
module.exports.showListings=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author", // Populates the author field in each review
        model: "User",
      },
    }).populate("owner");
    //const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");  
    if (!listing) {
        return res.status(404).send("Listing not found");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing }); 
};

module.exports.createListing=async(req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,"..",filename);
 const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
   
};
module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).send("Listing not found");
  }
  res.render("listings/edit", { listing });
};
 
module.exports.updateListing=async (req,res) => {
  let { id } = req.params;
//let listing=await Listing.findById(id);
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return res.status(404).send("Listing not found");
  }
  console.log("Deleted:", deletedListing);
   req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};
