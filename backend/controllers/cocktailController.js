
// import { uploadToCloudinary } from './path/to/cloudinaryMiddleware'; // Update the path accordingly

// import path from 'path'; //DELETE

// Configure multer for image upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Ensure the 'uploads/' directory exists
//     },
//     filename: function (req, file, cb) {
//         // Append the timestamp to the original filename to avoid name conflicts
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// }); //DELETE

// const upload = multer({ storage: storage });

// // Middleware to handle image upload
// const addImageToCocktail = (req, res, next) => {
//     upload.single('image')(req, res, (error) => {
//         if (error) {
//             return res.status(500).json({ message: error.message });
//         }
//         if (req.file) {
//             req.body.imageUrl = req.file.path; // Add image URL to the request body
//         }
//         next();
//     });
// }; //DELETE


// // Middleware to handle image upload
// const addImageToCocktail = (req, res, next) => {
//     upload.single('image')(req, res, (error) => {
//         if (error) {
//             return res.status(500).json({ message: error.message });
//         }
//         if (req.file) {
//             req.body.imageUrl = req.file.path; // Add image URL to the request body
//         }
//         next();
//     });
// }; //multer

import Cocktails from '../models/Cocktails';
import cloudinary from 'cloudinary';


// Get all or filtered cocktails
export const getCocktailsController = async (req, res) => {
    try {
        const { search, primaryLiquor, category, ingredientsCount, occasion, flavorProfile, prepTime, drinkware, strength, difficulty, color, allLiquors } = req.query;
        let query = Cocktails.find();

        if (primaryLiquor) {
            query = query.where({ primaryLiquor: new RegExp(primaryLiquor, 'i') });
        }
        if (allLiquors) {
            let liquorArray = Array.isArray(allLiquors) ? allLiquors : [allLiquors];
            query = query.where({ allLiquors: { $in: liquorArray } });
        }
        if (category) {
            query = query.where({ category: new RegExp(category, 'i') });
        }
        if (ingredientsCount) {
            query = query.where({ ingredientsCount: ingredientsCount });
        }
        if (occasion) {
            let occasionArray = Array.isArray(occasion) ? occasion : [occasion];
            query = query.where({ occasion: { $in: occasionArray } });
        }
        if (flavorProfile) {
            let flavorProfileArray = Array.isArray(flavorProfile) ? flavorProfile : [flavorProfile];
            query = query.where({ flavorProfile: { $in: flavorProfileArray } });
        }
        if (prepTime) {
            query = query.where({ prepTime: new RegExp(prepTime, 'i') });
        }
        if (drinkware) {
            query = query.where({ drinkware: new RegExp(drinkware, 'i') });
        }
        if (strength) {
            query = query.where({ strength: new RegExp(strength, 'i') });
        }
        if (difficulty) {
            query = query.where({ difficulty: new RegExp(difficulty, 'i') });
        }
        if (color) {
            query = query.where({ color: new RegExp(color, 'i') });
        }

        if (search) {
            const regexSearch = new RegExp('\\b' + search + '\\b', 'i');
            query = query.find({
                $or: [
                    { name: regexSearch },
                    { primaryLiquor: regexSearch },
                    { allLiquors: { $in: [regexSearch] } },
                    { ingredients: { $in: [regexSearch] } },
                    { instructions: regexSearch },
                    { category: regexSearch },
                    { color: regexSearch },
                    { occasion: { $in: [regexSearch] } },
                    { difficulty: regexSearch },
                    { flavorProfile: regexSearch },
                    { prepTime: regexSearch },
                    { drinkware: regexSearch },
                    { strength: regexSearch },
                    { tags: { $in: [regexSearch] } },
                    { creator: regexSearch },
                    { description: regexSearch },
                    {InspiredByCreator: { $in: [regexSearch] } },
                ]
            });
        }
        
        const cocktails = await query.sort({ name: 1 });
        res.json(cocktails);
     } catch (error) {
        res.status(500).send(error.message);
    }
}; //BEHOLD

// Get a single cocktail by ID
export const getCocktailByIdController = async (req, res) => {
    try {
        const cocktail = await Cocktails.findById(req.params.id);
        if (!cocktail) {
            return res.status(404).send('Cocktail not found');
        }
        res.json(cocktail);
    } catch (error) {
        res.status(500).send(error.message);
    }
}; //BEHOLD

//MIRELA:
// Create a new cocktail with image upload
export const addCocktailController = async (req, res) => {
    // Check admin role
    if (req.admin.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        // Add time and date to the recipe
        req.body.date = new Date();

        // Create a new cocktail document with the request body
        // The imageUrl will be added by the Cloudinary middleware if the image upload is successful
        const newCocktail = new Cocktails(req.body);
        await newCocktail.save();
        res.status(201).json(newCocktail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update cocktails (with or without updating picture)
export const updateCocktailController = async (req, res) => {
    //check admin role
    if (req.admin.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can update cocktails.' });
    }

    try {
        const cocktailId = req.params.id;
        let updatedData = req.body;

        const cocktail = await Cocktails.findById(cocktailId);
        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }

        // If a new image is uploaded and it's different from the existing one, update imageUrl
        if (req.body.imageUrl && cocktail.imageUrl !== req.body.imageUrl) {
            updatedData.imageUrl = req.body.imageUrl;
        }

        const updatedCocktail = await Cocktails.findByIdAndUpdate(cocktailId, updatedData, { new: true });
        res.status(200).json(updatedCocktail);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cocktail: ' + error.message });
    }
};

// Delete cocktail
export const deleteCocktailController = async (req, res) => {
    // Check admin role
    if (req.admin.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can delete cocktails.' });
    }

    try {
        const cocktailId = req.params.id;
        const cocktail = await Cocktails.findById(cocktailId);

        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }

        // Optional: Delete the image from Cloudinary
        // Extract public ID from imageUrl and use cloudinary.v2.uploader.destroy(publicId)
        // Example: cloudinary.v2.uploader.destroy('image_public_id')

        // If the cocktail has an image, delete it from Cloudinary
        if (cocktail.imageUrl) {
            const publicId = extractPublicIdFromUrl(cocktail.imageUrl);
            await cloudinary.v2.uploader.destroy(publicId);
        }

        await Cocktails.findByIdAndDelete(cocktailId);
        res.status(200).json({ message: 'Cocktail deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cocktail: ' + error.message });
    }
};

// Helper function to extract the public ID from the Cloudinary image URL
function extractPublicIdFromUrl(url) {
    // The implementation here depends on your Cloudinary URL structure.
    // Typically, you'll need to parse the URL to extract the part that represents the public ID.
    // This is an example and might need adjustment to fit your URL structure.
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension
    return publicId;}

// export const addCocktailController = [
//     uploadToCloudinary, // Use your Cloudinary middleware here
//     async (req, res) => {
//         // Check admin role:
//         if (req.admin.role !== 'admin') {
//             return res.status(403).json({ message: 'Access denied' });
//         }

//         // Add time and date to the recipe
//         req.body.date = new Date();
  
//         try {
//             const newCocktail = new Cocktails(req.body);
//             await newCocktail.save();
//             res.status(201).json(newCocktail);
//         } catch (error) {
//             res.status(400).json({ message: error.message });
//         }
//     }
// ]; //ADDED


//POSTMAN TESTING

////// Get All Cocktails//////
// Endpoint: /cocktails
// HTTP Method: GET
// Description: Retrieves a list of all cocktails.
// Controller Function: getCocktailsController
// Postman Setup: GET - body-none - http://localhost:3001/cocktails



////// Get Cocktail by ID //////
// Endpoint: /cocktails/:id
// HTTP Method: GET
// Description: Retrieves a single cocktail by its ID.
// Controller Function: getCocktailByIdController
// Postman Setup: GET - body-none - http://localhost:3001/cocktails/:id



////// Add New Cocktail //////
// Endpoint: /cocktails
// HTTP Method: POST
// Description: Creates a new cocktail.
// Controller Function: addCocktailController
// Postman Setup: POST - body-raw-json - http://localhost:3000/cocktails
// Example input:
/*{
    "name": "Classic Margarita",
    "primaryLiquor": "Tequila",
    "ingredients": ["2 oz Tequila", "1 oz Lime Juice", "1 oz Triple Sec", "Salt for rim", "Lime wedge for garnish"],
    "instructions": "Rub the rim of the glass with the lime slice to make the salt stick to it. Shake the tequila, lime juice, and triple sec with ice and strain into the glass. Garnish with a lime wedge.",
    "category": "Classic",
    "color": "Yellow",
    "ingredientsCount": 5,
    "creator": "Jane Smith",
    "occasion": ["Party", "Celebration"],
    "difficulty": "Medium",
    "flavorProfile": "Citrus and Strong",
    "imageUrl": "path/to/classic-margarita-image.jpg",
    "servings": 1,
    "prepTime": "10 minutes",
    "drinkware": "Margarita Glass",
    "strength": "Strong",
    "tags": ["Classic", "Citrus", "Strong"]
  }*/
  

  
////// Update Cocktail by ID

// Endpoint: /cocktails/:id
// HTTP Method: PUT
// Description: Updates an existing cocktail by its ID.
// Controller Function: updateCocktailController
// Postman Setup: PUT - body-raw-json - http://localhost:3000/cocktails/:id
// Example input:
/*{
    "name": "Fun Margarita",
    "primaryLiquor": "Tequila",
    "ingredients": ["2 oz Tequila", "1 oz Lime Juice", "1 oz Triple Sec", "Salt for rim", "Lime wedge for garnish"],
    "instructions": "Rub the rim of the glass with the lime slice to make the salt stick to it. Shake the tequila, lime juice, and triple sec with ice and strain into the glass. Garnish with a lime wedge.",
    "category": "Classic",
    "color": "Yellow",
    "ingredientsCount": 5,
    "creator": "Jane Smith",
    "occasion": ["Party", "Celebration"],
    "difficulty": "Medium",
    "flavorProfile": "Citrus and Strong",
    "imageUrl": "path/to/classic-margarita-image.jpg",
    "servings": 1,
    "prepTime": "10 minutes",
    "drinkware": "Margarita Glass",
    "strength": "Strong",
    "tags": ["Classic", "Citrus", "Strong"]
  }*/
  

////// Get All or Filtered Cocktails //////
// Endpoint: /cocktails
// HTTP Method: GET
// Description: Retrieves all cocktails or filters by category if category query is provided.
// Controller Function: getCocktailsController
// Postman Setup for All: GET - http://localhost:3000/cocktails
// Postman Setup for Category Filter: GET - http://localhost:3000/cocktails?category=Classic

////// Search Cocktails //////
// Endpoint: /cocktails
// HTTP Method: GET
// Description: Searches for cocktails by name or ingredients.
// Controller Function: getCocktailsController
// Postman Setup: GET - http://localhost:3000/cocktails?term=margarita

////// Delete Cocktail by ID //////

// Endpoint: /cocktails/:id
// HTTP Method: DELETE
// Description: Deletes a cocktail by its ID.
// Controller Function: deleteCocktailController
// Postman Setup: DELETE - body-none - http://localhost:3000/cocktails/:id

