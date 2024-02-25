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

async function getInventoryItemById (itemId) {
  // Query database to retrieve inventory item by ID
  // Example query: SELECT * FROM inventory WHERE inv_id = itemId
  const query = "SELECT * FROM inventory WHERE inv_id = $1";
  const values = [itemId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItemById};