const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryByInvId(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [invId]
    );
    console.log("Retrieved itemData:", data);
    return data.rows[0];
  } catch (error) {
    console.error("Error retrieving vehicle by ID: ", error);
    throw error;
  }
}

async function addClassification(classificationName) {
  try {
      await pool.query("INSERT INTO classification (classification_name) VALUES ($1)", [classificationName]);
  } catch (error) {
      console.error("Error adding classification to the database: ", error);
      throw error;
  }
}

async function addInventory(make, model, year, description, image, thumbnail, price, miles, color, classification_id) {
  try {
    // Execute the query to insert inventory data into the database
    await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [make, model, year, description, image, thumbnail, price, miles, color, classification_id]
    );
    return data.rows[0]
    // No need to return anything if the insertion is successful
  } catch (error) {
    console.error("Error adding inventory:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInvId, addClassification, addInventory };