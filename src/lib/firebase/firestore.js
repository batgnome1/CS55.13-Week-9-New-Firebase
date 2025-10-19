/**
 * Firestore Database Operations Module
 * 
 * This module provides functions for interacting with the Firestore database,
 * including CRUD operations for restaurants and reviews, real-time listeners,
 * and data filtering/sorting capabilities.
 * 
 * Key Features:
 * - Restaurant management (create, read, update)
 * - Review management with rating calculations
 * - Real-time data synchronization
 * - Advanced querying with filters and sorting
 * - Transaction support for data consistency
 * - Development data seeding
 */

// Import function to generate fake restaurant and review data for development/testing
import { generateModulesAndReviews } from "@/src/lib/fakeModules.js";

// Import Firebase Firestore functions for database operations
import {
  collection, // Reference to a collection in Firestore
  onSnapshot, // Real-time listener for document changes
  query, // Create a query for filtering and sorting documents
  getDocs, // Get all documents from a query
  doc, // Reference to a specific document
  getDoc, // Get a single document
  updateDoc, // Update a document's fields
  orderBy, // Sort documents by a field
  Timestamp, // Firebase timestamp type
  runTransaction, // Execute operations in a transaction
  where, // Filter documents by field values
  addDoc, // Add a new document to a collection
  getFirestore, // Get Firestore instance
} from "firebase/firestore";

// Import the Firestore database instance from the client app configuration
import { db } from "@/src/lib/firebase/clientApp";

/**
 * Update a restaurant's image reference in Firestore
 * This function updates the photo URL field of a restaurant document
 * @param {string} restaurantId - The ID of the restaurant to update
 * @param {string} publicImageUrl - The public URL of the uploaded image
 * @returns {Promise<void>} Promise that resolves when the update is complete
 */
export async function updateModuleImageReference(
  moduleId,
  publicImageUrl
) {
  // Create a reference to the specific restaurant document
  const moduleRef = doc(collection(db, "modules"), moduleId);
  if (moduleRef) {
    // Update the photo field with the new image URL
    await updateDoc(moduleRef, { photo: publicImageUrl });
  }
}

/**
 * Helper function to update restaurant rating statistics within a transaction
 * This function calculates new rating statistics and adds the review atomically
 * @param {Object} transaction - Firestore transaction object
 * @param {Object} docRef - Reference to the restaurant document
 * @param {Object} newRatingDocument - The new rating document being added
 * @param {Object} review - The review data
 * @returns {Promise<void>} Promise that resolves when the transaction is complete
 */
const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  // Get the current restaurant data within the transaction
  const module = await transaction.get(docRef);
  const data = module.data();
  
  // Calculate new rating statistics
  // Increment the total number of ratings (default to 1 if no ratings exist)
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  
  // Add the new rating to the sum (default to 0 if no sum exists)
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);
  
  // Calculate the new average rating
  const newAverage = newSumRating / newNumRatings;

  // Update the restaurant document with new rating statistics
  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
   // lastReviewUserId: review.userId,
  });

  // Add the new review document with current timestamp
  transaction.set(newRatingDocument, {
    ...review,
    timestamp: Timestamp.fromDate(new Date()),
  });
};


/**
 * Add a review to a restaurant and update its rating statistics
 * This function uses a transaction to ensure data consistency when adding reviews
 * @param {Object} db - Firestore database instance
 * @param {string} restaurantId - The ID of the restaurant to add the review to
 * @param {Object} review - The review data to add
 * @returns {Promise<void>} Promise that resolves when the review is added
 */
export async function addReviewToModule(db, moduleId, review) {
        // Validate required parameters
        if (!moduleId) {
                throw new Error("No module ID has been provided.");
        }

        if (!review) {
                throw new Error("A valid review has not been provided.");
        }

        try {
                // Create references to the restaurant document and new rating document
                const docRef = doc(collection(db, "modules"), moduleId);
                const newRatingDocument = doc(
                        collection(db, `modules/${moduleId}/ratings`)
                );

                // Use a transaction to atomically update restaurant stats and add the review
                // This ensures data consistency even if multiple reviews are added simultaneously
                await runTransaction(db, transaction =>
                        updateWithRating(transaction, docRef, newRatingDocument, review)
                );
        } catch (error) {
                // Log the error and re-throw it for the calling code to handle
                console.error(
                        "There was an error adding the rating to the module",
                        error
                );
                throw error;
        }
}



/**
 * Apply filtering and sorting to a Firestore query
 * This function builds a query with filters for category, city, price, and sorting options
 * @param {Object} q - The base Firestore query
 * @param {Object} filters - Filter options object
 * @param {string} filters.category - Filter by restaurant category
 * @param {string} filters.city - Filter by city location
 * @param {string} filters.price - Filter by price level (length of string determines price)
 * @param {string} filters.sort - Sort by "Rating" or "Review" count
 * @returns {Object} The modified query with filters applied
 */
function applyQueryFilters(q, { genre, players, difficulty, sort }) {
  // Filter by restaurant category if specified
  if (genre) {
    q = query(q, where("genre", "==", genre));
  }
  // Filter by city if specified
  if (players) {
    q = query(q, where("players", "==", players));
  }
  // Filter by price level (price string length determines the level)
  // e.g., "$" = 1, "$$" = 2, "$$$" = 3, "$$$$" = 4
  if (difficulty) {
    q = query(q, where("difficulty", "==", difficulty.length));
  }
  // Sort by average rating (default) or by number of reviews
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q;
}

/**
 * Get restaurants from Firestore with optional filtering
 * This function performs a one-time read of restaurant data with server-side filtering
 * @param {Object} db - Firestore database instance (defaults to client db)
 * @param {Object} filters - Filter options for the query
 * @returns {Promise<Array>} Promise that resolves to an array of restaurant objects
 */
export async function getModules(db = db, filters = {}) {
  // Create a base query for the restaurants collection
  let q = query(collection(db, "modules"));

  // Apply filters to the query
  q = applyQueryFilters(q, filters);
  
  // Execute the query and get all matching documents
  const results = await getDocs(q);
  
  // Transform the documents into plain objects for client components
  return results.docs.map((doc) => {
    return {
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread all document data
      // Convert Firestore timestamp to JavaScript Date object
      // Only plain objects can be passed to Client Components from Server Components
      // This conversion is necessary for Next.js serialization requirements
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

/**
 * Set up a real-time listener for restaurant data changes
 * This function creates a snapshot listener that triggers whenever restaurant data changes
 * @param {Function} cb - Callback function that receives the updated restaurant array
 * @param {Object} filters - Filter options for the query
 * @returns {Function} Unsubscribe function to stop listening to changes
 */
export function getModuleSnapshot(cb, filters = {}) {
  // Validate that the callback is a function
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  // Create a base query for the restaurants collection
  let q = query(collection(db, "modules"));
  // Apply filters to the query
  q = applyQueryFilters(q, filters);

  // Set up real-time listener for query changes
  return onSnapshot(q, (querySnapshot) => {
    // Transform the documents into plain objects for client components
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id, // Include the document ID
        ...doc.data(), // Spread all document data
        // Convert Firestore timestamp to JavaScript Date object
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    // Call the callback with the transformed results
    cb(results);
  });
}

/**
 * Get a single restaurant by its ID
 * This function performs a one-time read of a specific restaurant document
 * @param {Object} db - Firestore database instance
 * @param {string} restaurantId - The ID of the restaurant to retrieve
 * @returns {Promise<Object>} Promise that resolves to the restaurant object or undefined
 */
export async function getModuleById(db, moduleId) {
  // Validate the restaurant ID
  if (!moduleId) {
    console.log("Error: Invalid ID received: ", moduleId);
    return;
  }
  
  // Create a reference to the specific restaurant document
  const docRef = doc(db, "modules", moduleId);
  // Get the document snapshot
  const docSnap = await getDoc(docRef);
  
  // Return the document data with converted timestamp
  return {
    ...docSnap.data(), // Spread all document data
    timestamp: docSnap.data().timestamp.toDate(), // Convert timestamp to Date
  };
}

/**
 * Set up a real-time listener for a specific restaurant's data changes
 * This function creates a snapshot listener that triggers whenever a specific restaurant's data changes
 * @param {string} moduleId - The ID of the restaurant to listen to
 * @param {Function} cb - Callback function that receives the updated restaurant data
 * @returns {Function} Unsubscribe function to stop listening to changes
 */
export function getModuleSnapshotById(moduleId, cb) {
  // Validate the module ID
  if (!moduleId) {
    console.log("Error: Invalid moduleId received: ", moduleId);
    return;
  }

  // Validate that the callback is a function
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  // Create a reference to the specific module document
  const docRef = doc(db, "modules", moduleId);
  
  // Set up real-time listener for document changes
  return onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      // Transform the document into a plain object for client components
      const moduleData = {
        id: docSnapshot.id, // Include the document ID
        ...docSnapshot.data(), // Spread all document data
        // Convert Firestore timestamp to JavaScript Date object
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: docSnapshot.data().timestamp?.toDate(),
      };
      
      // Call the callback with the transformed data
      cb(moduleData);
    } else {
      console.log("No such module document!");
      cb(null);
    }
  });
}

/**
 * Get all reviews for a specific restaurant
 * This function performs a one-time read of all reviews for a restaurant, sorted by timestamp
 * @param {Object} db - Firestore database instance
 * @param {string} moduleId - The ID of the restaurant to get reviews for
 * @returns {Promise<Array>} Promise that resolves to an array of review objects
 */
export async function getReviewsByModuleId(db, moduleId) {
  // Validate the restaurant ID
  if (!moduleId) {
    console.log("Error: Invalid moduleId received: ", moduleId);
    return;
  }

  // Create a query for the restaurant's ratings subcollection, ordered by timestamp (newest first)
  const q = query(
    collection(db, "modules", moduleId, "ratings"),
    orderBy("timestamp", "desc")
  );

  // Execute the query and get all matching documents
  const results = await getDocs(q);
  
  // Transform the documents into plain objects for client components
  return results.docs.map((doc) => {
    return {
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread all document data
      // Convert Firestore timestamp to JavaScript Date object
      // Only plain objects can be passed to Client Components from Server Components
      // This conversion is necessary for Next.js serialization requirements
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

/**
 * Set up a real-time listener for restaurant reviews
 * This function creates a snapshot listener that triggers whenever reviews for a restaurant change
 * @param {string} restaurantId - The ID of the restaurant to listen to reviews for
 * @param {Function} cb - Callback function that receives the updated reviews array
 * @returns {Function} Unsubscribe function to stop listening to changes
 */
export function getReviewsSnapshotByModuleId(moduleId, cb) {
  // Validate the restaurant ID
  if (!moduleId) {
    console.log("Error: Invalid moduleId received: ", moduleId);
    return;
  }

  // Create a query for the restaurant's ratings subcollection, ordered by timestamp (newest first)
  const q = query(
    collection(db, "modules", moduleId, "ratings"),
    orderBy("timestamp", "desc")
  );
  
  // Set up real-time listener for query changes
  return onSnapshot(q, (querySnapshot) => {
    // Transform the documents into plain objects for client components
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id, // Include the document ID
        ...doc.data(), // Spread all document data
        // Convert Firestore timestamp to JavaScript Date object
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    // Call the callback with the transformed results
    cb(results);
  });
}

/**
 * Add fake restaurants and reviews to the database for development/testing
 * This function generates sample data and adds it to Firestore collections
 * @returns {Promise<void>} Promise that resolves when all data is added
 */
export async function addModulesAndReviews() {
  console.log("🌱 Starting to add modules and reviews...");
  
  try {
    // Generate fake restaurant and review data
    const data = await generateModulesAndReviews();
    console.log("📊 Generated data:", data.length, "modules");
    
    // Process each restaurant and its associated reviews
    for (const { moduleData, ratingsData } of data) {
      try {
        console.log("➕ Adding module:", moduleData.name);
        
        // Add the restaurant document to the restaurants collection
        const docRef = await addDoc(
          collection(db, "modules"),
          moduleData
        );
        
        console.log("✅ Module added with ID:", docRef.id);

        // Add each review to the restaurant's ratings subcollection
        for (const ratingData of ratingsData) {
          await addDoc(
            collection(db, "modules", docRef.id, "ratings"),
            ratingData
          );
        }
        
        console.log("✅ Added", ratingsData.length, " ratings");
      } catch (e) {
        // Log any errors that occur during the data addition process
        console.error("❌ Error adding module:", moduleData.name, e);
        throw e; // Re-throw to stop the process
      }
    }
    
    console.log("🎉 Successfully added all modules and reviews!");
  } catch (error) {
    console.error("❌ Error in addModulesAndReviews:", error);
    throw error;
  }
}
